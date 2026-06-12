import { Suspense } from "react";
import { Chrome, Trophy } from "lucide-react";
import { signInWithGoogle } from "@/lib/actions";

function LoginNotice({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400">
      {error}
    </div>
  );
}

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 bg-[#0A0E17]">
      
      {/* --- LEFT COLUMN: Branding & Image (Hidden on mobile) --- */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-900 p-12 lg:flex">
        {/* Background Image: Update the path to your actual image */}
        <div 
          className="absolute inset-0 bg-[url('/images/stadium-bg.png')] bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity" 
          aria-hidden="true"
        />
        {/* Gradients to darken edges for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-black/40" />

        {/* Top Logo */}
        

        {/* Center Typography */}
        <div className="relative z-10 mb-20 mt-auto">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#D4FF00]">
            WELCOME BACK
          </p>
          <h1 className="text-[5rem] font-black leading-[0.9] tracking-tighter text-white">
            THE GAME <br />
            <span className="text-[#D4FF00]">NEVER STOPS</span>
          </h1>
          <p className="mt-6 max-w-sm text-lg text-slate-300">
            Sign in to continue your football journey. <br />
            Stats. Predictions. Glory.
          </p>
        </div>

        {/* Bottom Footer / Official Partner Badge */}
        <div className="relative z-10 flex items-end gap-6">
          {/* Replace with actual FIFA World Cup logo if available */}
          <div className="flex flex-col items-center gap-1">
          </div>
          
          
            
          </div>
        </div>
      

      {/* --- RIGHT COLUMN: Login Form --- */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24">
        
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="mb-12 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-slate-950">
            <Trophy size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ScoreBite</span>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Sign in to ScoreBite
          </h2>
          <p className="mt-2 mb-10 text-sm text-slate-400">
            Access your matches, leagues and predictions.
          </p>

          <Suspense>
            <LoginNotice error={searchParams.error} />
          </Suspense>

          <form action={signInWithGoogle}>
            <button
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 active:scale-[0.98]"
              type="submit"
            >
              <Chrome size={18} className="text-slate-700" />
              Continue with Google
            </button>
          </form>

          {/* Legal Footer */}
          <p className="mt-10 text-center text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-[#D4FF00] transition-colors hover:text-yellow-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#D4FF00] transition-colors hover:text-yellow-400 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>

    </main>
  );
}