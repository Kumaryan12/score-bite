import { Trophy } from "lucide-react";
import { PredictorBadges } from "@/components/Badges";
import { initials } from "@/lib/helpers";

export type LeaderboardEntry = {
  userId: string;
  name: string | null;
  username?: string | null;
  avatarUrl: string | null;
  favoriteTeam?: string | null;
  totalPoints: number;
  exactScores: number;
  correctResults: number;
  streak: number;
};

export default function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mb-4 rounded-full border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <Trophy className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
        </div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          No predictions yet. The leaderboard will populate once friends lock in scores.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Sleek Header */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">League Standings</h2>
      </div>

      {/* Roster / Entries */}
      <div className="flex flex-col">
        {entries.map((entry, index) => {
          const isLeader = index === 0;

          // High-End Minimalist Row Styling
          let rowClass = "hover:bg-zinc-50 border-l-2 border-l-transparent dark:hover:bg-zinc-900/50";
          let rankClass = "text-zinc-500 dark:text-zinc-400";
          let nameClass = "text-zinc-900 dark:text-zinc-100 font-medium";
          let pointsClass = "text-zinc-900 dark:text-zinc-100";
          
          if (isLeader) {
            // The #1 spot gets a subtle grounding highlight instead of a neon glow
            rowClass = "bg-zinc-50/80 hover:bg-zinc-100/50 border-l-2 border-l-zinc-900 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 dark:border-l-zinc-100";
            rankClass = "text-zinc-900 font-semibold dark:text-zinc-100";
            nameClass = "text-zinc-900 font-semibold dark:text-zinc-100";
            pointsClass = "text-zinc-900 font-semibold dark:text-zinc-100";
          }

          return (
            <div
              className={`flex flex-col gap-4 border-b border-zinc-200 px-5 py-4 transition-colors last:border-b-0 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between ${rowClass}`}
              key={entry.userId}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-6 flex-shrink-0 text-center text-sm ${rankClass}`}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {entry.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={`${entry.name}'s avatar`} className="h-full w-full object-cover" src={entry.avatarUrl} />
                  ) : (
                    initials(entry.name)
                  )}
                </div>

                {/* User Info & Badges */}
                <div className="flex flex-col justify-center">
                  <p className={`text-sm ${nameClass}`}>
                    {entry.name ?? "Mystery predictor"}
                  </p>
                  
                  {(entry.username || entry.favoriteTeam) && (
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {entry.username ? `@${entry.username}` : ""}
                      {entry.username && entry.favoriteTeam ? " · " : ""}
                      {entry.favoriteTeam ?? ""}
                    </p>
                  )}
                  
                  <div className="mt-1.5">
                    <PredictorBadges
                      correctResults={entry.correctResults}
                      exactScores={entry.exactScores}
                      streak={entry.streak}
                    />
                  </div>
                </div>
              </div>

              {/* Total Points */}
              <div className="flex items-baseline justify-end gap-1.5 sm:justify-start">
                <p className={`text-2xl ${pointsClass}`}>
                  {entry.totalPoints}
                </p>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}