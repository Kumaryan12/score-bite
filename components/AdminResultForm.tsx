import { CheckCircle2, DatabaseZap } from "lucide-react";
import type { Match } from "@/types/db";
import { seedSampleMatchesAction, submitResultAction } from "@/lib/actions";
import { formatMatchTime } from "@/lib/helpers";

export default function AdminResultForm({ matches }: { matches: Match[] }) {
  return (
    <div className="grid gap-4">
      <form action={seedSampleMatchesAction} className="surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-ink">Import World Cup schedule</h2>
          <p className="text-sm text-ink/65">Upserts all 104 FIFA World Cup 2026 matches.</p>
        </div>
        <button className="button-secondary" type="submit">
          <DatabaseZap size={17} />
          Import matches
        </button>
      </form>

      {matches.map((match) => (
        <form action={submitResultAction} className="surface p-5" key={match.id}>
          <input name="match_id" type="hidden" value={match.id} />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-pitch/70">
                {match.stage} · {formatMatchTime(match.kickoff_time)}
              </p>
              <h3 className="mt-2 text-xl font-black text-ink">
                {match.team_a} vs {match.team_b}
              </h3>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <input
                aria-label={`${match.team_a} score`}
                className="field w-20 text-center text-xl font-black"
                defaultValue={match.team_a_score ?? 0}
                min={0}
                name="team_a_score"
                type="number"
              />
              <span className="font-black text-ink/35">-</span>
              <input
                aria-label={`${match.team_b} score`}
                className="field w-20 text-center text-xl font-black"
                defaultValue={match.team_b_score ?? 0}
                min={0}
                name="team_b_score"
                type="number"
              />
            </div>
            <button className="button-primary" type="submit">
              <CheckCircle2 size={17} />
              Save result
            </button>
          </div>
        </form>
      ))}
    </div>
  );
}
