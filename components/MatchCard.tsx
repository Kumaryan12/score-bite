import Link from "next/link";
import { CalendarClock, MapPin, Lock, Pencil } from "lucide-react";
import type { Match } from "@/types/db";
import { formatMatchTime, isPredictionLocked, resultText } from "@/lib/helpers";
import { StatusBadge } from "@/components/Badges";

export default function MatchCard({
  match,
  leagueId,
  prediction
}: {
  match: Match;
  leagueId?: string;
  prediction?: {
    pred_team_a_score: number;
    pred_team_b_score: number;
    points_awarded: number | null;
    stake_text: string | null;
  } | null;
}) {
  const locked = isPredictionLocked(match);

  return (
    <article className="surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-pitch/70">
            {match.stage}
            {match.group_name ? ` · ${match.group_name}` : ""}
          </p>
          <h3 className="mt-2 text-xl font-black text-ink">
            {match.team_a} <span className="text-ink/35">vs</span> {match.team_b}
          </h3>
        </div>
        <StatusBadge status={match.status} />
      </div>

      <div className="mt-4 grid gap-2 text-sm text-ink/70">
        <p className="flex items-center gap-2">
          <CalendarClock size={16} />
          {formatMatchTime(match.kickoff_time)}
        </p>
        {match.venue ? (
          <p className="flex items-center gap-2">
            <MapPin size={16} />
            {match.venue}
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-xs font-bold text-ink/55">Result</p>
          <p className="text-lg font-black text-ink">{resultText(match)}</p>
        </div>
        <div className="rounded-lg bg-limepop/25 p-3">
          <p className="text-xs font-bold text-ink/55">Your pick</p>
          <p className="text-lg font-black text-ink">
            {prediction ? `${prediction.pred_team_a_score} - ${prediction.pred_team_b_score}` : "None"}
          </p>
          {prediction?.stake_text ? <p className="mt-1 text-xs font-bold text-salsa">{prediction.stake_text}</p> : null}
        </div>
      </div>

      {leagueId ? (
        <Link className="button-secondary mt-4 w-full" href={`/league/${leagueId}/match/${match.id}`}>
          {locked ? <Lock size={17} /> : <Pencil size={17} />}
          {locked ? "View pick" : "Predict"}
        </Link>
      ) : null}
    </article>
  );
}
