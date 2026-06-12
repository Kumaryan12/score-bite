import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import CopyInviteButton from "@/components/CopyInviteButton";
import Leaderboard, { type LeaderboardEntry } from "@/components/Leaderboard";
import MatchCard from "@/components/MatchCard";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import type { League, Match, Prediction, Profile, StakeSettlement } from "@/types/db";

function buildLeaderboard(
  members: Array<{ user_id: string; profiles: Profile | null }>,
  predictions: Prediction[]
): LeaderboardEntry[] {
  return members
    .map((member) => {
      const userPredictions = predictions.filter((prediction) => prediction.user_id === member.user_id);
      const completed = userPredictions
        .filter((prediction) => prediction.points_awarded !== null)
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
      let streak = 0;

      for (const prediction of completed) {
        if ((prediction.points_awarded ?? 0) > 0) {
          streak += 1;
        } else {
          break;
        }
      }

      return {
        userId: member.user_id,
        name: member.profiles?.full_name ?? null,
        username: member.profiles?.username ?? null,
        avatarUrl: member.profiles?.avatar_url ?? null,
        favoriteTeam: member.profiles?.favorite_team ?? null,
        totalPoints: userPredictions.reduce((sum, prediction) => sum + (prediction.points_awarded ?? 0), 0),
        exactScores: userPredictions.filter((prediction) => prediction.points_awarded === 5).length,
        correctResults: userPredictions.filter((prediction) => (prediction.points_awarded ?? 0) > 0).length,
        streak
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints || b.exactScores - a.exactScores || a.name?.localeCompare(b.name ?? "") || 0);
}

export default async function LeaguePage({
  params
}: {
  params: { leagueId: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("league_members")
    .select("id,role")
    .eq("league_id", params.leagueId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect("/dashboard?error=You do not belong to that league.");
  }

  const [{ data: league }, { data: members }, { data: predictions }, { data: matches }, { data: settlements }] =
    await Promise.all([
      supabase.from("leagues").select("*").eq("id", params.leagueId).single(),
      supabase.from("league_members").select("user_id, profiles(id,full_name,avatar_url,created_at)").eq("league_id", params.leagueId),
      supabase.from("predictions").select("*").eq("league_id", params.leagueId),
      supabase.from("matches").select("*").order("kickoff_time", { ascending: true }),
      supabase.from("stake_settlements").select("*").eq("league_id", params.leagueId).order("created_at", { ascending: false })
    ]);

  if (!league) {
    redirect("/dashboard?error=League not found.");
  }

  const typedLeague = league as League;
  const typedPredictions = (predictions ?? []) as Prediction[];
  const leaderboard = buildLeaderboard((members ?? []) as any, typedPredictions);
  const userPredictions = new Map(
    typedPredictions
      .filter((prediction) => prediction.user_id === user.id)
      .map((prediction) => [prediction.match_id, prediction])
  );
  const profileIds = Array.from(
    new Set(
      ((settlements ?? []) as StakeSettlement[]).flatMap((settlement) => [settlement.owed_by, settlement.owed_to])
    )
  );
  const { data: settlementProfiles } =
    profileIds.length > 0 ? await supabase.from("profiles").select("*").in("id", profileIds) : { data: [] };
  const profileMap = new Map(((settlementProfiles ?? []) as Profile[]).map((profile) => [profile.id, profile]));

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Private league</p>
          <h1 className="mt-2 text-4xl font-black text-ink">{typedLeague.name}</h1>
          <CopyInviteButton inviteCode={typedLeague.invite_code} />
        </div>
        <Link className="button-secondary" href="/admin">
          <ShieldCheck size={17} />
          Admin results
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Leaderboard entries={leaderboard} />

        <div className="surface p-5">
          <h2 className="text-xl font-black text-ink">Friendly stakes</h2>
          <div className="mt-4 grid gap-3">
            {((settlements ?? []) as StakeSettlement[]).length > 0 ? (
              ((settlements ?? []) as StakeSettlement[]).slice(0, 5).map((settlement) => (
                <div className="rounded-lg border border-mustard/20 bg-mustard/10 p-3 text-sm" key={settlement.id}>
                  <span className="font-black text-ink">{profileMap.get(settlement.owed_by)?.full_name ?? "Someone"}</span>
                  <span className="text-ink/65"> owes </span>
                  <span className="font-black text-ink">{profileMap.get(settlement.owed_to)?.full_name ?? "a friend"}</span>
                  <span className="text-ink/65">: {settlement.stake_text}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/65">Stakes appear here after results are entered. Nothing is enforced.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-black text-ink">Matches</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {((matches ?? []) as Match[]).map((match) => (
            <MatchCard
              key={match.id}
              leagueId={params.leagueId}
              match={match}
              prediction={userPredictions.get(match.id) ?? null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
