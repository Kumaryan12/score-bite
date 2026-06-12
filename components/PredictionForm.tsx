import { Save } from "lucide-react";
import type { Match, Prediction } from "@/types/db";
import { savePredictionAction } from "@/lib/actions";
import { isPredictionLocked, stakeIdeas } from "@/lib/helpers";

export default function PredictionForm({
  leagueId,
  match,
  prediction
}: {
  leagueId: string;
  match: Match;
  prediction: Prediction | null;
}) {
  const locked = isPredictionLocked(match);

  return (
    <form action={savePredictionAction} className="surface p-5">
      <input name="league_id" type="hidden" value={leagueId} />
      <input name="match_id" type="hidden" value={match.id} />

      <fieldset className="space-y-5" disabled={locked}>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Your score</p>
          <h2 className="mt-2 text-2xl font-black text-ink">
            {match.team_a} vs {match.team_b}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2 text-sm font-bold text-ink/75">
            {match.team_a}
            <input
              className="field text-center text-2xl font-black"
              defaultValue={prediction?.pred_team_a_score ?? 0}
              min={0}
              name="pred_team_a_score"
              type="number"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink/75">
            {match.team_b}
            <input
              className="field text-center text-2xl font-black"
              defaultValue={prediction?.pred_team_b_score ?? 0}
              min={0}
              name="pred_team_b_score"
              type="number"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-ink/75">
          Friendly stake
          <input
            className="field"
            defaultValue={prediction?.stake_text ?? ""}
            list="stake-ideas"
            maxLength={80}
            name="stake_text"
            placeholder="Coffee, pizza, funny dare..."
          />
        </label>
        <datalist id="stake-ideas">
          {stakeIdeas.map((idea) => (
            <option key={idea} value={idea} />
          ))}
        </datalist>
      </fieldset>

      {locked ? (
        <p className="mt-5 rounded-lg bg-mustard/30 px-4 py-3 text-sm font-bold text-ink">
          Predictions are locked for this match.
        </p>
      ) : (
        <button className="button-primary mt-5 w-full" type="submit">
          <Save size={17} />
          Save prediction
        </button>
      )}
    </form>
  );
}
