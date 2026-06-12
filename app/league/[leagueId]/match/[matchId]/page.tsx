import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, MapPin } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { formatMatchTime, resultText } from "@/lib/helpers";
import { predictionLabel } from "@/lib/scoring";
import type { Match, Prediction } from "@/types/db";

export default async function MatchPredictionPage({
  params,
  searchParams
}: {
  params: { leagueId: string; matchId: string };
  searchParams: { error?: string; saved?: string };
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
    .select("id")
    .eq("league_id", params.leagueId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect("/dashboard?error=You do not belong to that league.");
  }

  const [{ data: match }, { data: prediction }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", params.matchId).single(),
    supabase
      .from("predictions")
      .select("*")
      .eq("league_id", params.leagueId)
      .eq("match_id", params.matchId)
      .eq("user_id", user.id)
      .maybeSingle()
  ]);

  if (!match) {
    redirect(`/league/${params.leagueId}`);
  }

  const typedMatch = match as Match;
  const typedPrediction = prediction as Prediction | null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link className="button-secondary mb-5" href={`/league/${params.leagueId}`}>
        <ArrowLeft size={17} />
        Back to league
      </Link>

      {searchParams.error ? (
        <p className="mb-5 rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa">{searchParams.error}</p>
      ) : null}
      {searchParams.saved ? (
        <p className="mb-5 rounded-lg bg-limepop/45 px-4 py-3 text-sm font-bold text-pitch">Prediction saved.</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <PredictionForm leagueId={params.leagueId} match={typedMatch} prediction={typedPrediction} />

        <aside className="surface p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Match details</p>
          <h1 className="mt-2 text-3xl font-black text-ink">
            {typedMatch.team_a} vs {typedMatch.team_b}
          </h1>
          <div className="mt-5 grid gap-3 text-sm text-ink/70">
            <p className="flex items-center gap-2">
              <CalendarClock size={16} />
              {formatMatchTime(typedMatch.kickoff_time)}
            </p>
            {typedMatch.venue ? (
              <p className="flex items-center gap-2">
                <MapPin size={16} />
                {typedMatch.venue}
              </p>
            ) : null}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-pitch/10 p-3">
              <p className="text-xs font-bold text-ink/55">Result</p>
              <p className="text-xl font-black text-ink">{resultText(typedMatch)}</p>
            </div>
            <div className="rounded-lg bg-limepop/25 p-3">
              <p className="text-xs font-bold text-ink/55">Points</p>
              <p className="text-xl font-black text-pitch">{typedPrediction?.points_awarded ?? "-"}</p>
            </div>
          </div>
          <p className="mt-5 rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-ink shadow-sm">
            {predictionLabel(typedPrediction?.points_awarded ?? null)}
          </p>
        </aside>
      </div>
    </section>
  );
}
