import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import CopyInviteButton from "@/components/CopyInviteButton";

export default function LeagueCard({
  id,
  name,
  inviteCode,
  memberCount,
  totalPoints
}: {
  id: string;
  name: string;
  inviteCode: string;
  memberCount: number;
  totalPoints: number;
}) {
  return (
    <article className="group rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </h2>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          <Trophy size={18} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Your points</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {totalPoints}
          </p>
        </div>
        <CopyInviteButton compact inviteCode={inviteCode} />
      </div>

      <Link 
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white" 
        href={`/league/${id}`}
      >
        View standings
        <ArrowRight size={15} />
      </Link>
    </article>
  );
}