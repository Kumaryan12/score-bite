import { Users } from "lucide-react";
import { joinLeagueAction } from "@/lib/actions";

export default function JoinLeaguePage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <form action={joinLeagueAction} className="surface p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Invite code</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Join a league</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Paste the code a friend sent you.</p>
        {searchParams.error ? (
          <p className="mt-5 rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa">{searchParams.error}</p>
        ) : null}
        <label className="mt-6 grid gap-2 text-sm font-bold text-ink/75">
          Invite code
          <input className="field uppercase" maxLength={10} minLength={4} name="invite_code" placeholder="SB2026" required />
        </label>
        <button className="button-primary mt-5 w-full" type="submit">
          <Users size={18} />
          Join league
        </button>
      </form>
    </section>
  );
}
