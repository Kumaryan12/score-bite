"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";
import { generateInviteCode } from "@/lib/helpers";
import { calculatePredictionPoints } from "@/lib/scoring";
import { fifaLeagueName } from "@/lib/names";
import { fetchWorldCup2026Matches } from "@/lib/worldCupSchedule";
import { OPEN_PREDICTION_MATCH_LIMIT } from "@/lib/predictionWindow";

type ResultPrediction = {
  id: string;
  league_id: string;
  user_id: string;
  pred_team_a_score: number;
  pred_team_b_score: number;
  stake_text: string | null;
};

function setupErrorMessage(message?: string | null) {
  if (
    message?.includes("Could not find the table") ||
    message?.includes("schema cache") ||
    message?.includes("relation") && message?.includes("does not exist")
  ) {
    return "Supabase tables are missing. Run supabase/schema.sql in your Supabase SQL editor, then refresh and try again.";
  }

  return message ?? "Something went wrong.";
}

async function requireUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Supabase is not configured yet. Add your real project URL and anon key to .env.local, then restart the dev server.");
  }

  const supabase = createServerSupabaseClient();
  const origin = headers().get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // FIX: Added ?next=/dashboard to ensure proper routing after login
      redirectTo: `${origin}/auth/callback?next=/dashboard`
    }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();
  const bio = String(formData.get("bio") ?? "").trim();
  const favoriteTeam = String(formData.get("favorite_team") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  if (username && !/^[a-z0-9_]{3,24}$/.test(username)) {
    redirect("/profile?error=Username must be 3-24 characters using letters, numbers, or underscores.");
  }

  if (bio.length > 180) {
    redirect("/profile?error=Bio must be 180 characters or fewer.");
  }

  if (avatarUrl) {
    try {
      const parsedUrl = new URL(avatarUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid image URL.");
      }
    } catch {
      redirect("/profile?error=Avatar must be a valid image URL.");
    }
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: username || null,
    full_name: fullName || user.user_metadata.full_name || user.user_metadata.name || user.email,
    bio: bio || null,
    favorite_team: favoriteTeam || null,
    avatar_url: avatarUrl || user.user_metadata.avatar_url || null
  });

  if (error) {
    const message = error.message.includes("profiles_username_key")
      ? "That username is already taken."
      : setupErrorMessage(error.message);
    redirect(`/profile?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  redirect("/profile?saved=1");
}

export async function createLeagueAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const fallbackName = fifaLeagueName(user.user_metadata.full_name ?? user.user_metadata.name);
  const name = String(formData.get("name") ?? fallbackName).trim() || fallbackName;

  if (name.length < 3) {
    redirect("/create-league?error=League name must be at least 3 characters.");
  }

  let createdLeagueId: string | null = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const inviteCode = generateInviteCode();
    const { data, error } = await supabase.rpc("create_league_for_current_user", {
      league_name: name,
      invite_code_input: inviteCode
    });

    if (!error && data) {
      createdLeagueId = data;
      break;
    }

    lastError = setupErrorMessage(error?.message ?? "Could not create league.");
  }

  if (!createdLeagueId) {
    redirect(`/create-league?error=${encodeURIComponent(lastError ?? "Invite code collision. Try again.")}`);
  }

  revalidatePath("/dashboard");
  redirect(`/league/${createdLeagueId}`);
}

export async function joinLeagueAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const inviteCode = String(formData.get("invite_code") ?? "")
    .trim()
    .toUpperCase();

  const { data: leagueId, error } = await supabase.rpc("join_league_by_invite", {
    invite_code_input: inviteCode
  });

  if (error || !leagueId) {
    redirect("/join-league?error=Invite code not found.");
  }

  revalidatePath("/dashboard");
  redirect(`/league/${leagueId}`);
}

export async function savePredictionAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const leagueId = String(formData.get("league_id") ?? "");
  const matchId = String(formData.get("match_id") ?? "");
  const predA = Number(formData.get("pred_team_a_score"));
  const predB = Number(formData.get("pred_team_b_score"));
  const stakeText = String(formData.get("stake_text") ?? "").trim();

  if (!Number.isInteger(predA) || !Number.isInteger(predB) || predA < 0 || predB < 0) {
    redirect(`/league/${leagueId}/match/${matchId}?error=Use whole numbers for both scores.`);
  }

  const { data: member } = await supabase
    .from("league_members")
    .select("id")
    .eq("league_id", leagueId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member) {
    redirect("/dashboard?error=Join the league before predicting.");
  }

  const { data: match } = await supabase
    .from("matches")
    .select("kickoff_time,status")
    .eq("id", matchId)
    .single();

  if (!match || match.status !== "scheduled" || new Date(match.kickoff_time).getTime() <= Date.now()) {
    redirect(`/league/${leagueId}/match/${matchId}?error=Predictions are locked for this match.`);
  }

  const { data: openMatches } = await supabase
    .from("matches")
    .select("id")
    .eq("status", "scheduled")
    .gt("kickoff_time", new Date().toISOString())
    .order("kickoff_time", { ascending: true })
    .limit(OPEN_PREDICTION_MATCH_LIMIT);
  const isInPredictionWindow = (openMatches ?? []).some((openMatch: { id: string }) => openMatch.id === matchId);

  if (!isInPredictionWindow) {
    redirect(`/league/${leagueId}/match/${matchId}?error=Predictions are only open for the next ${OPEN_PREDICTION_MATCH_LIMIT} upcoming matches.`);
  }

  const { error } = await supabase.from("predictions").upsert(
    {
      league_id: leagueId,
      match_id: matchId,
      user_id: user.id,
      pred_team_a_score: predA,
      pred_team_b_score: predB,
      stake_text: stakeText || null,
      points_awarded: null,
      submitted_at: new Date().toISOString()
    },
    { onConflict: "league_id,match_id,user_id" }
  );

  if (error) {
    redirect(`/league/${leagueId}/match/${matchId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/league/${leagueId}`);
  redirect(`/league/${leagueId}/match/${matchId}?saved=1`);
}

export async function submitResultAction(formData: FormData) {
  const { supabase, user } = await requireUser();
  const matchId = String(formData.get("match_id") ?? "");
  const scoreA = Number(formData.get("team_a_score"));
  const scoreB = Number(formData.get("team_b_score"));

  if (!Number.isInteger(scoreA) || !Number.isInteger(scoreB) || scoreA < 0 || scoreB < 0) {
    redirect("/admin?error=Use whole numbers for both scores.");
  }

  const { data: adminMembership } = await supabase
    .from("league_members")
    .select("id")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .maybeSingle();

  if (!adminMembership) {
    redirect("/dashboard?error=Only league owners or admins can enter results.");
  }

  const { error: matchError } = await supabase
    .from("matches")
    .update({
      team_a_score: scoreA,
      team_b_score: scoreB,
      status: "completed"
    })
    .eq("id", matchId);

  if (matchError) {
    redirect(`/admin?error=${encodeURIComponent(matchError.message)}`);
  }

  const { data: rawPredictions } = await supabase
    .from("predictions")
    .select("id,league_id,user_id,pred_team_a_score,pred_team_b_score,stake_text")
    .eq("match_id", matchId);
  const predictions = (rawPredictions ?? []) as ResultPrediction[];

  const scoredPredictions =
    predictions.map((prediction) => ({
      id: prediction.id,
      points_awarded: calculatePredictionPoints(
        scoreA,
        scoreB,
        prediction.pred_team_a_score,
        prediction.pred_team_b_score
      )
    }));

  for (const prediction of scoredPredictions) {
    await supabase.from("predictions").update({ points_awarded: prediction.points_awarded }).eq("id", prediction.id);
  }

  const byLeague = new Map<string, NonNullable<typeof predictions>>();
  for (const prediction of predictions) {
    byLeague.set(prediction.league_id, [...(byLeague.get(prediction.league_id) ?? []), prediction]);
  }

  await supabase.from("stake_settlements").delete().eq("match_id", matchId);

  for (const [leagueId, leaguePredictions] of byLeague) {
    const scored = leaguePredictions.map((prediction) => ({
      ...prediction,
      points: calculatePredictionPoints(
        scoreA,
        scoreB,
        prediction.pred_team_a_score,
        prediction.pred_team_b_score
      )
    }));
    const topScore = Math.max(...scored.map((prediction) => prediction.points));
    const firstWinner = scored.find((prediction) => prediction.points === topScore);

    if (!firstWinner || topScore === 0) {
      continue;
    }

    const settlements = scored
      .filter((prediction) => prediction.points === 0 && prediction.stake_text && prediction.user_id !== firstWinner.user_id)
      .map((prediction) => ({
        league_id: leagueId,
        match_id: matchId,
        owed_by: prediction.user_id,
        owed_to: firstWinner.user_id,
        stake_text: prediction.stake_text!
      }));

    if (settlements.length > 0) {
      await supabase.from("stake_settlements").insert(settlements);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin?saved=1");
}

export async function seedSampleMatchesAction() {
  const { supabase } = await requireUser();
  const matches = await fetchWorldCup2026Matches();
  const { error } = await supabase.from("matches").upsert(matches, {
    onConflict: "match_number"
  });

  if (error) {
    redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/matches");
  redirect("/admin?seeded=1");
}
