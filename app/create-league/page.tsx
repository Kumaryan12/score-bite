import { Trophy } from "lucide-react";
import { createLeagueAction } from "@/lib/actions";
import { fifaLeagueName } from "@/lib/names";
import { createServerSupabaseClient } from "@/lib/supabaseClient";

export default async function CreateLeaguePage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const displayName = user?.user_metadata.full_name ?? user?.user_metadata.name;
  const defaultLeagueName = fifaLeagueName(displayName);

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <form action={createLeagueAction} className="surface p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Private league</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Create a league</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Invite codes keep the league private to your friends.
        </p>
        {searchParams.error ? (
          <p className="mt-5 rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa">{searchParams.error}</p>
        ) : null}
        <label className="mt-6 grid gap-2 text-sm font-bold text-ink/75">
          League name
          <input className="field" defaultValue={defaultLeagueName} minLength={3} name="name" required />
        </label>
        <button className="button-primary mt-5 w-full" type="submit">
          <Trophy size={18} />
          Create league
        </button>
      </form>
    </section>
  );
}
