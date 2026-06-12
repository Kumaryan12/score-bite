import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, Users } from "lucide-react";
import LeagueCard from "@/components/LeagueCard";
import MatchCard from "@/components/MatchCard";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import type { League, Match, Prediction } from "@/types/db";

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
    .select("*")
    .order("kickoff_time", { ascending: true })
    .limit(6);

  const upcoming = ((matches ?? []) as Match[]).filter((match) => match.status !== "completed").slice(0, 3);
  const completed = ((matches ?? []) as Match[]).filter((match) => match.status === "completed").slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Your leagues</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link className="button-primary" href="/create-league">
            <PlusCircle size={17} />
            Create league
          </Link>
          <Link className="button-secondary" href="/join-league">
            <Users size={17} />
            Join league
          </Link>
        </div>
      </div>

      {searchParams.error ? (
        <p className="mt-5 rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa">{searchParams.error}</p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leagueCards.map((league) => (
          <LeagueCard
            id={league.id}
            inviteCode={league.invite_code}
            key={league.id}
            memberCount={league.memberCount}
            name={league.name}
            totalPoints={league.totalPoints}
          />
        ))}
      </div>

      {leagueCards.length === 0 ? (
        <div className="surface mt-6 p-6 text-sm text-ink/65">
          Create a private league or join one with an invite code to start predicting.
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-black text-ink">Upcoming matches</h2>
          <div className="grid gap-4">
            {upcoming.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-black text-ink">Completed matches</h2>
          <div className="grid gap-4">
            {completed.length > 0 ? completed.map((match) => <MatchCard key={match.id} match={match} />) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
