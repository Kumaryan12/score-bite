import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Match } from "@/types/db";

export const stakeIdeas = ["Burger", "Pizza", "Coffee", "Treat", "Funny dare"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length = 7): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function formatMatchTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function isPredictionLocked(match: Pick<Match, "kickoff_time" | "status">): boolean {
  return match.status !== "scheduled" || new Date(match.kickoff_time).getTime() <= Date.now();
}

export function resultText(match: Pick<Match, "team_a_score" | "team_b_score">): string {
  if (match.team_a_score === null || match.team_b_score === null) {
    return "TBD";
  }

  return `${match.team_a_score} - ${match.team_b_score}`;
}

export function initials(name?: string | null): string {
  if (!name) {
    return "SB";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
