import type { Match } from "@/types/db";

export const OPEN_PREDICTION_MATCH_LIMIT = 2;

export function getOpenPredictionMatchIds(
  matches: Array<Pick<Match, "id" | "kickoff_time" | "status">>,
  now = new Date()
) {
  const nowMs = now.getTime();

  return new Set(
    matches
      .filter((match) => match.status === "scheduled" && new Date(match.kickoff_time).getTime() > nowMs)
      .sort((a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime())
      .slice(0, OPEN_PREDICTION_MATCH_LIMIT)
      .map((match) => match.id)
  );
}
