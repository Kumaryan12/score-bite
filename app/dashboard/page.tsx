import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, Users, Activity, CheckCircle2 } from "lucide-react";
import LeagueCard from "@/components/LeagueCard";
import MatchCard from "@/components/MatchCard";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import type { League, Match, Prediction } from "@/types/db";

const MATCH_CARD_COLUMNS =
  "id,match_number,tournament,stage,group_name,team_a,team_b,kickoff_time,venue,team_a_score,team_b_score,status,created_at";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // --- Logic remains exactly the same ---
  const { data: memberships } = await supabase
    .from("league_members")
    .select("league_id, leagues(id,name,invite_code,created_by,created_at)")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  const leagueRows = (memberships ?? [])
    .map((membership: any) => membership.leagues as League | null)
    .filter(Boolean) as League[];
  const leagueIds = leagueRows.map((league) => league.id);

  const { data: predictions } =
    leagueIds.length > 0
      ? await supabase.from("predictions").select("league_id,points_awarded").eq("user_id", user.id).in("league_id", leagueIds)
      : { data: [] };
  const typedPredictions = (predictions ?? []) as Array<Pick<Prediction, "league_id" | "points_awarded">>;

  const leagueCards = await Promise.all(
    leagueRows.map(async (league) => {
      const { count } = await supabase
        .from("league_members")
        .select("id", { count: "exact", head: true })
        .eq("league_id", league.id);

      const totalPoints =
        typedPredictions
          ?.filter((prediction) => prediction.league_id === league.id)
          .reduce((sum, prediction) => sum + (prediction.points_awarded ?? 0), 0) ?? 0;

      return {
        ...league,
        memberCount: count ?? 0,
        totalPoints
      };
    })
  );

  const { data: matches } = await supabase
    .from("matches")
    .select(MATCH_CARD_COLUMNS)
    .order("kickoff_time", { ascending: true })
    .limit(6);

  const upcoming = ((matches ?? []) as Match[]).filter((match) => match.status !== "completed").slice(0, 3);
  const completed = ((matches ?? []) as Match[]).filter((match) => match.status === "completed").slice(0, 3);

  return (
    <>
      {/* Injecting smooth, pure CSS animations for page load */}
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

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="animate-fade-in flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" style={{ animationDelay: "0ms" }}>
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Overview</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Your Leagues
            </h1>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link 
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100" 
              href="/join-league"
            >
              <Users size={16} />
              Join league
            </Link>
            <Link 
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-white" 
              href="/create-league"
            >
              <PlusCircle size={16} />
              Create league
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {searchParams.error && (
          <div className="animate-fade-in mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400" style={{ animationDelay: "50ms" }}>
            {searchParams.error}
          </div>
        )}

        {/* Leagues Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leagueCards.map((league, index) => (
            <div 
              key={league.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${(index + 1) * 75}ms` }}
            >
              <LeagueCard
                id={league.id}
                inviteCode={league.invite_code}
                memberCount={league.memberCount}
                name={league.name}
                totalPoints={league.totalPoints}
              />
            </div>
          ))}
        </div>

        {/* Empty State for Leagues */}
        {leagueCards.length === 0 && (
          <div 
            className="animate-fade-in mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
            style={{ animationDelay: "100ms" }}
          >
            <div className="mb-4 rounded-full border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
              <Users className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No leagues found</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              Create a private league or join one with an invite code to start predicting match scores with friends.
            </p>
          </div>
        )}

        {/* Match Center Section */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-8">
          
          {/* Upcoming Matches Column */}
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                <Activity size={18} className="text-zinc-400 dark:text-zinc-500" />
                Upcoming Matches
              </h2>
            </div>
            <div className="grid gap-4">
              {upcoming.length > 0 ? (
                upcoming.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="py-4 text-sm text-zinc-500 dark:text-zinc-400">No upcoming matches at the moment.</p>
              )}
            </div>
          </div>

          {/* Completed Matches Column */}
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="mb-5 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                <CheckCircle2 size={18} className="text-zinc-400 dark:text-zinc-500" />
                Completed Matches
              </h2>
            </div>
            <div className="grid gap-4">
              {completed.length > 0 ? (
                completed.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="py-4 text-sm text-zinc-500 dark:text-zinc-400">No completed matches yet.</p>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
