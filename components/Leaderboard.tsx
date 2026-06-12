import { RankBadge, PredictorBadges } from "@/components/Badges";
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
      <div className="surface p-5 text-sm text-ink/65">
        No predictions yet. The leaderboard wakes up as soon as friends start picking scores.
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xl font-black text-ink">Leaderboard</h2>
      </div>
      <div className="divide-y divide-white/10">
        {entries.map((entry, index) => (
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between" key={entry.userId}>
            <div className="flex items-center gap-3">
              <RankBadge rank={index + 1} />
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-pitch text-sm font-black text-slate-950">
                {entry.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="" className="h-full w-full object-cover" src={entry.avatarUrl} />
                ) : (
                  initials(entry.name)
                )}
              </div>
              <div>
                <p className="font-black text-ink">{entry.name ?? "Mystery predictor"}</p>
                {entry.username || entry.favoriteTeam ? (
                  <p className="mb-2 text-xs font-bold text-ink/50">
                    {entry.username ? `@${entry.username}` : ""}
                    {entry.username && entry.favoriteTeam ? " · " : ""}
                    {entry.favoriteTeam ?? ""}
                  </p>
                ) : null}
                <PredictorBadges
                  correctResults={entry.correctResults}
                  exactScores={entry.exactScores}
                  streak={entry.streak}
                />
              </div>
            </div>
            <p className="text-3xl font-black text-pitch">{entry.totalPoints}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
