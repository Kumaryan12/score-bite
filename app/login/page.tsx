import { Suspense } from "react";
import { Chrome } from "lucide-react";
import { signInWithGoogle } from "@/lib/actions";

function LoginNotice({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="rounded-lg bg-salsa/10 px-4 py-3 text-sm font-bold text-salsa">{error}</p>;
}

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-5 px-4 py-16 sm:px-6">
      <div className="surface p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-salsa">Welcome in</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Sign in to ScoreBite</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Google sign-in keeps private leagues tied to real friends without passwords.
        </p>
        <Suspense>
          <LoginNotice error={searchParams.error} />
        </Suspense>
        <form action={signInWithGoogle} className="mt-6">
          <button className="button-primary w-full" type="submit">
            <Chrome size={18} />
            Continue with Google
          </button>
        </form>
      </div>
    </section>
  );
}
