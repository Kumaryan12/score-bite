import { Suspense } from "react";
import { Chrome, Trophy } from "lucide-react";
import { signInWithGoogle } from "@/lib/actions";

function LoginNotice({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <div className="mb-6 animate-pulse rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400 backdrop-blur-md">
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
    <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6">
      
      {/* --- Pure CSS Animations for the WOW factor --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .ambient-glow-1 {
          animation: float 12s ease-in-out infinite;
        }
        .ambient-glow-2 {
          animation: float 15s ease-in-out infinite reverse;
        }
      `}</style>

      {/* --- Ambient Background Orbs --- */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen">
        {/* Electric Lime Glow */}
        <div className="ambient-glow-1 absolute left-10 top-10 h-[400px] w-[400px] rounded-full bg-[#D4FF00]/10 blur-[100px]"></div>
        {/* Deep Blue/Teal Glow */}
        <div className="ambient-glow-2 absolute bottom-10 right-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]"></div>
      </div>

      {/* --- Login Card --- */}
      <div className="animate-fade-up relative z-10 w-full max-w-md">
        
        {/* Logo Placement */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
            <Trophy size={32} className="text-zinc-100" strokeWidth={1.5} />
          </div>
        </div>

        {/* Card Body */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
              Welcome to ScoreBite
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Prove your ball knowledge. Google sign-in keeps private leagues tied to real friends without the hassle of passwords.
            </p>
          </div>

          <div className="mt-8">
            <Suspense>
              <LoginNotice error={searchParams.error} />
            </Suspense>

            <form action={signInWithGoogle}>
              <button
                className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.98]"
                type="submit"
              >
                <Chrome size={18} className="text-zinc-700 transition-colors group-hover:text-zinc-900" />
                Continue with Google
                
                {/* Subtle button border glow effect on hover */}
                <div className="absolute inset-0 -z-10 rounded-xl bg-white/20 opacity-0 blur transition-opacity group-hover:opacity-100"></div>
              </button>
            </form>
          </div>

          {/* Footer inside card */}
          <div className="mt-8 text-center text-xs text-zinc-500">
            By continuing, you agree to secure bragging rights. <br />
            No odds. No gambling.
          </div>
        </div>
      </div>

    </main>
  );
}