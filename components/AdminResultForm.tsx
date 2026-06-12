import { CheckCircle2, DatabaseZap } from "lucide-react";
import PendingButton from "@/components/PendingButton";
import type { Match } from "@/types/db";
import { seedSampleMatchesAction, submitResultAction } from "@/lib/actions";
import { formatMatchTime } from "@/lib/helpers";

export default function AdminResultForm({ matches }: { matches: Match[] }) {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <div className="grid gap-6">
        
        {/* Bulk Action / Seed Form */}
        <form 
          action={seedSampleMatchesAction} 
          className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Import Match Schedule
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Upserts all 104 FIFA World Cup 2026 matches into the database.
            </p>
          </div>
          <PendingButton
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 sm:w-auto"
            pendingText="Importing..."
          >
            <DatabaseZap size={16} />
            Import matches
          </PendingButton>
        </form>

        {/* Matches List */}
        <div className="grid gap-4">
          {matches.map((match, index) => (
            <form 
              action={submitResultAction} 
              className="animate-fade-in flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between sm:p-6" 
              key={match.id}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <input name="match_id" type="hidden" value={match.id} />
              
              {/* Match Details */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {match.stage} <span className="mx-1.5 opacity-50">•</span> {formatMatchTime(match.kickoff_time)}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {match.team_a} <span className="mx-1 font-normal text-zinc-400">vs</span> {match.team_b}
                </h3>
              </div>

              {/* Action Area: Inputs & Submit */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                
                {/* Score Inputs */}
                <div className="flex items-center justify-center gap-3">
                  <input
                    aria-label={`${match.team_a} score`}
                    className="h-12 w-16 rounded-lg border border-zinc-200 bg-zinc-50 text-center text-lg font-semibold text-zinc-900 transition-colors placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100 [&::-webkit-inner-spin-button]:appearance-none"
                    defaultValue={match.team_a_score ?? 0}
                    min={0}
                    name="team_a_score"
                    type="number"
                  />
                  <span className="text-zinc-300 dark:text-zinc-600">-</span>
                  <input
                    aria-label={`${match.team_b} score`}
                    className="h-12 w-16 rounded-lg border border-zinc-200 bg-zinc-50 text-center text-lg font-semibold text-zinc-900 transition-colors placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100 [&::-webkit-inner-spin-button]:appearance-none"
                    defaultValue={match.team_b_score ?? 0}
                    min={0}
                    name="team_b_score"
                    type="number"
                  />
                </div>

                {/* Save Button */}
                <PendingButton
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto sm:py-2.5"
                  pendingText="Updating result..."
                >
                  <CheckCircle2 size={16} />
                  Save
                </PendingButton>

              </div>
            </form>
          ))}
        </div>
      </div>
    </>
  );
}
