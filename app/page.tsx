import Link from "next/link";
import { Coffee, Flame, ShieldCheck, Trophy } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabaseClient";

export default async function LandingPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
      <div>
        <p className="inline-flex rounded-full border border-pitch/25 bg-pitch/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-pitch">
          World Cup predictions, friend mode
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-6xl">
          ScoreBite
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
          Create a private league, predict scores before kickoff, and assign friendly stakes like coffee, pizza,
          treats, or dares. Bragging rights only.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary" href={user ? "/dashboard" : "/login"}>
            <Trophy size={18} />
            {user ? "Open dashboard" : "Start your league"}
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="surface p-5 ring-1 ring-pitch/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-salsa">Tonight</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Argentina vs Denmark</h2>
            </div>
            <span className="rounded-lg bg-mustard p-3 font-black text-slate-950">8:00</span>
          </div>
          <div className="mt-6 grid grid-cols-3 items-center gap-3">
            <div className="rounded-lg bg-limepop/35 p-4 text-center">
              <p className="text-sm font-bold text-ink/60">Aryan</p>
              <p className="text-3xl font-black text-pitch">2</p>
            </div>
            <p className="text-center text-2xl font-black text-ink/30">-</p>
            <div className="rounded-lg bg-skybite/35 p-4 text-center">
              <p className="text-sm font-bold text-ink/60">Maya</p>
              <p className="text-3xl font-black text-pitch">1</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-ink shadow-sm">
              <Coffee size={16} />
              Coffee stake
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-ink shadow-sm">
              <Flame size={16} />
              3-match streak
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-ink shadow-sm">
              <ShieldCheck size={16} />
              Private league
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
