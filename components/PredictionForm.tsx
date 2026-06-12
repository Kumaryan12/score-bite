import { Lock } from "lucide-react";
import type { Match, Prediction } from "@/types/db";
import { savePredictionAction } from "@/lib/actions";
import { isPredictionLocked, stakeIdeas } from "@/lib/helpers";

export default function PredictionForm({
  leagueId,
  match,
  prediction,
}: {
  leagueId: string;
  match: Match;
  prediction: Prediction | null;
}) {
  const locked = isPredictionLocked(match);

  return (
    <form
      action={savePredictionAction}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input name="league_id" type="hidden" value={leagueId} />
      <input name="match_id" type="hidden" value={match.id} />

      <fieldset className="space-y-8" disabled={locked}>
        {/* Simple, clean header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {match.team_a} <span className="mx-2 font-normal text-zinc-400">vs</span> {match.team_b}
          </h2>
        </div>

        {/* Score Inputs Container */}
        <div className="flex items-center justify-center gap-6">
          {/* Team A Input */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="pred_team_a" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {match.team_a}
            </label>
            <input
              id="pred_team_a"
              className="h-16 w-16 rounded-xl border border-zinc-200 bg-zinc-50 text-center text-3xl font-bold text-zinc-900 transition-colors placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 [&::-webkit-inner-spin-button]:appearance-none"
              defaultValue={prediction?.pred_team_a_score ?? ""}
              min={0}
              name="pred_team_a_score"
              type="number"
              placeholder="-"
              required
            />
          </div>

          {/* Center Divider */}
          <div className="mt-6 text-2xl font-light text-zinc-300 dark:text-zinc-700">
            -
          </div>

          {/* Team B Input */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="pred_team_b" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {match.team_b}
            </label>
            <input
              id="pred_team_b"
              className="h-16 w-16 rounded-xl border border-zinc-200 bg-zinc-50 text-center text-3xl font-bold text-zinc-900 transition-colors placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 [&::-webkit-inner-spin-button]:appearance-none"
              defaultValue={prediction?.pred_team_b_score ?? ""}
              min={0}
              name="pred_team_b_score"
              type="number"
              placeholder="-"
              required
            />
          </div>
        </div>

        {/* Stake Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="stake" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Friendly stake
          </label>
          <input
            id="stake"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100"
            defaultValue={prediction?.stake_text ?? ""}
            list="stake-ideas"
            maxLength={80}
            name="stake_text"
            placeholder="Coffee, lunch, bragging rights..."
          />
          <datalist id="stake-ideas">
            {stakeIdeas.map((idea) => (
              <option key={idea} value={idea} />
            ))}
          </datalist>
        </div>
      </fieldset>

      {/* Action Area */}
      <div className="mt-6">
        {locked ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 py-3.5 text-sm font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <Lock size={16} />
            Predictions are locked
          </div>
        ) : (
          <button
            className="w-full rounded-lg bg-zinc-900 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-white"
            type="submit"
          >
            Save prediction
          </button>
        )}
      </div>
    </form>
  );
}