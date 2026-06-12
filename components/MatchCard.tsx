import Link from "next/link";
import { CalendarClock, MapPin, Lock } from "lucide-react";
import type { Match } from "@/types/db";
import { formatMatchTime, isPredictionLocked, resultText } from "@/lib/helpers";
import { StatusBadge } from "@/components/Badges";

export default function MatchCard({
  match,
  leagueId,
  prediction,
  canPredict = false,
}: {
  match: Match;
  leagueId?: string;
  canPredict?: boolean;
  prediction?: {
    pred_team_a_score: number;
    pred_team_b_score: number;
    points_awarded: number | null;
    stake_text: string | null;
  } | null;
}) {
  const locked = isPredictionLocked(match);
  const predictionsOpen = !locked && canPredict;

  return (
    <article className="group rounded-xl border border-zinc-200 bg-white p-5 transition-colors duration-150 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 sm:p-6">
      {/* Header: Stage, Time, and Status */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {match.stage}
            {match.group_name ? ` · ${match.group_name}` : ""}
          </p>
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <p className="flex items-center gap-1.5">
              <CalendarClock size={14} className="text-zinc-400 dark:text-zinc-500" />
              {formatMatchTime(match.kickoff_time)}
            </p>
            {match.venue && (
              <p className="hidden items-center gap-1.5 sm:flex">
                <MapPin size={14} className="text-zinc-400 dark:text-zinc-500" />
                {match.venue}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Centerpiece: The Teams */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex-1 text-right">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {match.team_a}
          </h3>
        </div>
        <div className="px-6">
          <span className="text-sm font-normal text-zinc-400">vs</span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {match.team_b}
          </h3>
        </div>
      </div>

      {/* Data Grid: Actual Result vs User Pick */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {/* Match Result Block */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Match result</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {resultText(match) || "—"}
          </p>
        </div>

        {/* User Pick Block */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Your pick</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {prediction ? `${prediction.pred_team_a_score} - ${prediction.pred_team_b_score}` : "—"}
          </p>
        </div>
      </div>

      {/* Fun Stake Badge */}
      {prediction?.stake_text && (
        <div className="mb-5 flex justify-center">
          <div className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            Stake: {prediction.stake_text}
          </div>
        </div>
      )}

      {/* Call to Action Button */}
      {leagueId && (
        <Link
          href={`/league/${leagueId}/match/${match.id}`}
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            locked || !predictionsOpen
              ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          }`}
        >
          {(locked || !predictionsOpen) && <Lock size={15} />}
          {locked ? "View details" : predictionsOpen ? "Make prediction" : "Opens soon"}
        </Link>
      )}
    </article>
  );
}
