import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Flame, CalendarRange } from "lucide-react";
import CopyInviteButton from "@/components/CopyInviteButton";
import Leaderboard, { type LeaderboardEntry } from "@/components/Leaderboard";
import MatchCard from "@/components/MatchCard";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { getOpenPredictionMatchIds } from "@/lib/predictionWindow";
import type { League, Match, Prediction, Profile, StakeSettlement } from "@/types/db";

const LEAGUE_COLUMNS = "id,name,invite_code,created_by,created_at";
const MATCH_CARD_COLUMNS =
  "id,match_number,tournament,stage,group_name,team_a,team_b,kickoff_time,venue,team_a_score,team_b_score,status,created_at";
const PREDICTION_COLUMNS =
  "id,league_id,match_id,user_id,pred_team_a_score,pred_team_b_score,stake_text,points_awarded,submitted_at";
const STAKE_SETTLEMENT_COLUMNS = "id,league_id,match_id,owed_by,owed_to,stake_text,settled,created_at";
const PROFILE_COLUMNS = "id,username,full_name,bio,favorite_team,avatar_url,created_at";

// Keep logic exactly the same
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
      supabase.from("leagues").select(LEAGUE_COLUMNS).eq("id", params.leagueId).single(),
      supabase
        .from("league_members")
        .select("user_id, profiles(id,username,full_name,avatar_url,favorite_team,created_at)")
        .eq("league_id", params.leagueId),
      supabase.from("predictions").select(PREDICTION_COLUMNS).eq("league_id", params.leagueId),
      supabase.from("matches").select(MATCH_CARD_COLUMNS).order("kickoff_time", { ascending: true }),
      supabase
        .from("stake_settlements")
        .select(STAKE_SETTLEMENT_COLUMNS)
        .eq("league_id", params.leagueId)
        .order("created_at", { ascending: false })
    ]);

  if (!league) {
    redirect("/dashboard?error=League not found.");
  }

  const typedLeague = league as League;
  const typedMatches = (matches ?? []) as Match[];
  const typedPredictions = (predictions ?? []) as Prediction[];
  const openPredictionMatchIds = getOpenPredictionMatchIds(typedMatches);
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
    profileIds.length > 0 ? await supabase.from("profiles").select(PROFILE_COLUMNS).in("id", profileIds) : { data: [] };
  const profileMap = new Map(((settlementProfiles ?? []) as Profile[]).map((profile) => [profile.id, profile]));

  return (
    <>
      {/* Pure CSS Animations for Page Load */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        
        {/* Header Section */}
        <div className="animate-fade-in flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" style={{ animationDelay: "0ms" }}>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Private League</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {typedLeague.name}
            </h1>
            <div className="mt-4">
              <CopyInviteButton inviteCode={typedLeague.invite_code} />
            </div>
          </div>
          <Link 
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 sm:w-auto" 
            href="/admin"
          >
            <ShieldCheck size={16} />
            Admin Panel
          </Link>
        </div>

        {/* Top Grid: Leaderboard & Stakes */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          
          {/* Main Leaderboard */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Leaderboard entries={leaderboard} />
          </div>

          {/* Friendly Stakes Sidebar */}
          <aside className="animate-fade-in rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950" style={{ animationDelay: "200ms" }}>
            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800/50">
              <Flame size={18} className="text-orange-500" />
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Friendly Stakes</h2>
            </div>
            
            <div className="grid gap-3">
              {((settlements ?? []) as StakeSettlement[]).length > 0 ? (
                ((settlements ?? []) as StakeSettlement[]).slice(0, 5).map((settlement) => (
                  <div className="flex flex-col gap-1.5 rounded-xl border border-orange-200/50 bg-orange-50/50 p-4 text-sm dark:border-orange-900/30 dark:bg-orange-950/20" key={settlement.id}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{profileMap.get(settlement.owed_by)?.full_name ?? "Someone"}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">owes</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{profileMap.get(settlement.owed_to)?.full_name ?? "a friend"}</span>
                    </div>
                    <div className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="mt-0.5 text-orange-500">↳</span>
                      <span className="font-medium">{settlement.stake_text}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Stakes appear here after results are entered. Everything here is purely for bragging rights and fun.
                </p>
              )}
            </div>
          </aside>

        </div>

        {/* Matches Section */}
        <div className="animate-fade-in mt-12" style={{ animationDelay: "300ms" }}>
          <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                <CalendarRange size={20} className="text-zinc-400 dark:text-zinc-500" />
                League Matches
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Predictions are open for the next 2 upcoming matches only.
              </p>
            </div>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2">
            {typedMatches.map((match) => (
              <MatchCard
                key={match.id}
                leagueId={params.leagueId}
                match={match}
                canPredict={openPredictionMatchIds.has(match.id)}
                prediction={userPredictions.get(match.id) ?? null}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}
