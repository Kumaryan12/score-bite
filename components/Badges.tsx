import { Award, Flame, Medal, Sparkles } from "lucide-react";
import { cn } from "@/lib/helpers";

export function RankBadge({ rank }: { rank: number }) {
  const styles =
    rank === 1
      ? "bg-mustard text-slate-950"
      : rank === 2
        ? "bg-skybite text-slate-950"
        : rank === 3
          ? "bg-salsa text-slate-950"
          : "bg-white/10 text-ink/70";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black", styles)}>
      <Medal size={14} />
      #{rank}
    </span>
  );
}

export function PredictorBadges({
  exactScores,
  correctResults,
  streak
}: {
  exactScores: number;
  correctResults: number;
  streak?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {exactScores > 0 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-limepop/80 px-3 py-1 text-xs font-bold text-slate-950">
          <Award size={13} />
          {exactScores} exact
        </span>
      ) : null}
      {correctResults > 0 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-skybite/80 px-3 py-1 text-xs font-bold text-slate-950">
          <Sparkles size={13} />
          {correctResults} results
        </span>
      ) : null}
      {streak && streak > 1 ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-salsa/15 px-3 py-1 text-xs font-bold text-salsa">
          <Flame size={13} />
          {streak} streak
        </span>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: "scheduled" | "live" | "completed" }) {
  const label = status === "scheduled" ? "Upcoming" : status === "live" ? "Live" : "Final";
  const styles =
    status === "completed"
      ? "bg-pitch text-slate-950"
      : status === "live"
        ? "bg-salsa text-slate-950"
        : "bg-mustard text-slate-950";

  return <span className={cn("rounded-full px-3 py-1 text-xs font-black", styles)}>{label}</span>;
}
