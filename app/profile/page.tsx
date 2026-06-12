import { redirect } from "next/navigation";
import { Camera, Save, UserRound } from "lucide-react";
import PendingButton from "@/components/PendingButton";
import { updateProfileAction } from "@/lib/actions";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { initials } from "@/lib/helpers";
import type { Profile } from "@/types/db";

export default async function ProfilePage({
  searchParams
}: {
  searchParams: { error?: string; saved?: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,username,full_name,bio,favorite_team,avatar_url,created_at")
    .eq("id", user.id)
    .maybeSingle();
  const typedProfile = profile as Profile | null;
  const fullName = typedProfile?.full_name ?? user.user_metadata.full_name ?? user.user_metadata.name ?? "";
  const avatarUrl = typedProfile?.avatar_url ?? user.user_metadata.avatar_url ?? "";

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="surface overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Profile</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Edit your player card</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            This is how friends see you on leaderboards, predictions, and stake reminders.
          </p>
        </div>

        <form action={updateProfileAction} className="grid gap-6 p-6">
          {searchParams.error ? (
            <p className="rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa" role="alert">{searchParams.error}</p>
          ) : null}
          {searchParams.saved ? (
            <p aria-live="polite" className="rounded-lg bg-pitch/10 px-4 py-3 text-sm font-bold text-pitch" role="status">Profile saved.</p>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/10 text-2xl font-black text-pitch">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="h-full w-full object-cover" src={avatarUrl} />
              ) : (
                initials(fullName)
              )}
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-2 text-sm font-black text-ink">
                <Camera size={16} />
                Avatar image URL
              </p>
              <input
                className="field mt-2"
                defaultValue={avatarUrl}
                name="avatar_url"
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-ink/75">
              Display name
              <input className="field" defaultValue={fullName} maxLength={60} name="full_name" placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-ink/75">
              Username
              <span className="flex items-center rounded-lg border border-white/10 bg-white/10 focus-within:border-pitch focus-within:ring-4 focus-within:ring-pitch/20">
                <span className="pl-4 text-sm font-black text-ink/45">@</span>
                <input
                  className="w-full bg-transparent px-2 py-3 text-sm text-ink outline-none placeholder:text-ink/35"
                  defaultValue={typedProfile?.username ?? ""}
                  maxLength={24}
                  minLength={3}
                  name="username"
                  placeholder="scoreboss"
                />
              </span>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-ink/75">
            Favorite team
            <input
              className="field"
              defaultValue={typedProfile?.favorite_team ?? ""}
              maxLength={40}
              name="favorite_team"
              placeholder="Argentina, Japan, Brazil..."
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-ink/75">
            Bio
            <textarea
              className="field min-h-28 resize-y"
              defaultValue={typedProfile?.bio ?? ""}
              maxLength={180}
              name="bio"
              placeholder="Late equalizer believer. Coffee stakes only."
            />
          </label>

          <PendingButton className="button-primary" pendingText="Saving profile...">
            <Save size={17} />
            Save profile
          </PendingButton>
        </form>
      </div>
    </section>
  );
}
