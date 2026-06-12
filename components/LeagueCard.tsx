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
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">{memberCount} friends</p>
          <h2 className="mt-2 text-2xl font-black text-ink">{name}</h2>
        </div>
        <span className="rounded-lg bg-limepop/55 p-3 text-pitch">
          <Trophy size={22} />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-pitch/10 p-3">
          <p className="text-xs font-bold text-ink/60">Your points</p>
          <p className="text-2xl font-black text-pitch">{totalPoints}</p>
        </div>
        <CopyInviteButton compact inviteCode={inviteCode} />
      </div>

      <Link className="button-primary mt-5 w-full" href={`/league/${id}`}>
        Open league
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
