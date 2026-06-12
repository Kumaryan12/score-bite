import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
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
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Navigation */}
      <Link 
        className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 mb-8" 
        href={`/league/${params.leagueId}`}
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
        Back to league
      </Link>

      {/* Alerts */}
      {searchParams.error && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle size={18} />
          {searchParams.error}
        </div>
      )}
      {searchParams.saved && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircle2 size={18} />
          Prediction successfully saved.
        </div>
      )}

      {/* Main Grid */}
      <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Left Column: Form */}
        <div>
          <PredictionForm leagueId={params.leagueId} match={typedMatch} prediction={typedPrediction} />
        </div>

        {/* Right Column: Match Details Sidebar */}
        <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          
          {/* Sidebar Header */}
          <div className="mb-6 border-b border-zinc-100 pb-6 dark:border-zinc-800/50">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Match details
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {typedMatch.team_a} <span className="mx-1 font-normal text-zinc-400">vs</span> {typedMatch.team_b}
            </h1>
            
            <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="flex items-center gap-2">
                <CalendarClock size={16} className="text-zinc-400 dark:text-zinc-500" />
                {formatMatchTime(typedMatch.kickoff_time)}
              </p>
              {typedMatch.venue && (
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-zinc-400 dark:text-zinc-500" />
                  {typedMatch.venue}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Final result</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {resultText(typedMatch) || "—"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Points earned</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {typedPrediction?.points_awarded ?? "—"}
              </p>
            </div>
          </div>

          {/* Status Label */}
          <div className="mt-4 flex items-center justify-center rounded-xl bg-zinc-100 px-4 py-3.5 text-sm font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {predictionLabel(typedPrediction?.points_awarded ?? null)}
          </div>
        </aside>

      </div>
    </section>
  );
}