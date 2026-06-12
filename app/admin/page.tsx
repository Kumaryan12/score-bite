import { redirect } from "next/navigation";
import AdminResultForm from "@/components/AdminResultForm";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import type { Match } from "@/types/db";

const ADMIN_MATCH_COLUMNS =
  "id,match_number,tournament,stage,group_name,team_a,team_b,kickoff_time,venue,team_a_score,team_b_score,status,created_at";

export default async function AdminPage({
  searchParams
}: {
  searchParams: { error?: string; saved?: string; seeded?: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminMembership } = await supabase
    .from("league_members")
    .select("id")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .maybeSingle();

  if (!adminMembership) {
    redirect("/dashboard?error=Only league owners or admins can enter results.");
  }

  const { data: matches } = await supabase
    .from("matches")
    .select(ADMIN_MATCH_COLUMNS)
    .order("kickoff_time", { ascending: true });

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Admin</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Match results</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">
          Enter final scores to recalculate points and generate friendly stake reminders.
        </p>
      </div>

      {searchParams.error ? (
        <p className="mt-5 rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa" role="alert">{searchParams.error}</p>
      ) : null}
      {searchParams.saved ? (
        <p aria-live="polite" className="mt-5 rounded-lg bg-limepop/45 px-4 py-3 text-sm font-bold text-pitch" role="status">Result saved.</p>
      ) : null}
      {searchParams.seeded ? (
        <p aria-live="polite" className="mt-5 rounded-lg bg-limepop/45 px-4 py-3 text-sm font-bold text-pitch" role="status">Sample matches seeded.</p>
      ) : null}

      <div className="mt-6">
        <AdminResultForm matches={(matches ?? []) as Match[]} />
      </div>
    </section>
  );
}
