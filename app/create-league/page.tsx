import { Trophy, AlertCircle } from "lucide-react";
import PendingButton from "@/components/PendingButton";
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
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <section className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
        <form 
          action={createLeagueAction} 
          className="animate-fade-in rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        >
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Private League
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Create a league
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Invite codes will keep the league private to your friends.
            </p>
          </div>

          {searchParams.error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400" role="alert">
              <AlertCircle size={18} />
              {searchParams.error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              League name
            </label>
            <input 
              id="name"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100" 
              defaultValue={defaultLeagueName} 
              minLength={3} 
              name="name" 
              required 
            />
          </div>

          <PendingButton
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            pendingText="Creating..."
          >
            <Trophy size={18} />
            Create league
          </PendingButton>
        </form>
      </section>
    </>
  );
}
