import MatchCard from "@/components/MatchCard";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import type { Match } from "@/types/db";

export default async function MatchesPage() {
  const supabase = createServerSupabaseClient();
  const { data: matches } = await supabase.from("matches").select("*").order("kickoff_time", { ascending: true });
  const typedMatches = (matches ?? []) as Match[];
  const upcoming = typedMatches.filter((match) => match.status !== "completed");
  const completed = typedMatches.filter((match) => match.status === "completed");

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">FIFA World Cup 2026</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Upcoming matches</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
          The global schedule is shared by every ScoreBite league. Join or create a league to submit predictions.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {upcoming.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {typedMatches.length === 0 ? (
        <div className="surface mt-6 p-6 text-sm text-ink/65">
          No matches have been imported yet. A league owner can import the World Cup schedule from the admin page.
        </div>
      ) : null}

      {completed.length > 0 ? (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-black text-ink">Completed</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completed.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
