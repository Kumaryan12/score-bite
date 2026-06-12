import Link from "next/link";
import { Coffee, Flame, ShieldCheck, Trophy, ArrowRight, Star } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabaseClient";

export default async function LandingPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <>
      <style>{`
        /* The 3-Second Cinematic Intro Curtain */
        @keyframes introCurtain {
          0%, 75% { opacity: 1; z-index: 100; pointer-events: auto; backdrop-filter: blur(40px); }
          100% { opacity: 0; z-index: -1; pointer-events: none; backdrop-filter: blur(0px); }
        }
        @keyframes introLogo {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          20% { transform: scale(1) translateY(0); opacity: 1; }
          75% { transform: scale(1.05) translateY(0); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1.2) translateY(-20px); opacity: 0; filter: blur(10px); }
        }

        /* Hero Staggered Entrances */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal-1 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 2.5s forwards; opacity: 0; }
        .animate-reveal-2 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 2.7s forwards; opacity: 0; }
        .animate-reveal-3 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 2.9s forwards; opacity: 0; }
        
        /* Floating Glass Card Animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          50% { transform: translateY(-20px) rotate(-1deg); box-shadow: 0 35px 60px -15px rgba(212, 255, 0, 0.15); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite 3.2s; /* Starts after intro */
          opacity: 0;
          animation-fill-mode: forwards;
        }

        /* Ambient Stadium Lights */
        @keyframes pulse-light {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        .stadium-light-red { animation: pulse-light 10s ease-in-out infinite; }
        .stadium-light-blue { animation: pulse-light 12s ease-in-out infinite reverse; }
        .stadium-light-lime { animation: pulse-light 8s ease-in-out infinite 1s; }
      `}</style>

      {/* --- THE 3-SECOND INTRO CURTAIN --- */}
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950"
        style={{ animation: 'introCurtain 3.2s ease-out forwards' }}
      >
        <div style={{ animation: 'introLogo 3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} className="flex flex-col items-center text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_100px_rgba(212,255,0,0.3)] backdrop-blur-xl">
            <Trophy size={48} className="text-[#D4FF00]" strokeWidth={1.5} />
            {/* Tiny stars representing the 3 host nations */}
            <Star size={10} className="absolute left-3 top-3 text-white/50 fill-white/50" />
            <Star size={10} className="absolute right-3 top-3 text-white/50 fill-white/50" />
            <Star size={10} className="absolute bottom-3 right-3 text-white/50 fill-white/50" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">North America 2026</p>
          <h1 className="mt-2 text-4xl font-black tracking-tighter text-white sm:text-6xl">SCOREBITE</h1>
        </div>
      </div>

      {/* --- MAIN LANDING PAGE --- */}
      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950">
        
        {/* Ambient Stadium Lighting (USA/NA 2026 Colors + Lime) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
          <div className="stadium-light-red absolute -left-[10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-red-600/20 blur-[120px]"></div>
          <div className="stadium-light-blue absolute -right-[10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]"></div>
          <div className="stadium-light-lime absolute left-[20%] top-[40%] h-[400px] w-[400px] rounded-full bg-[#D4FF00]/10 blur-[100px]"></div>
        </div>

        <section className="relative mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-32">
          
          {/* Left Column: Hero Copy */}
          <div className="relative z-10">
            <div className="animate-reveal-1">
              <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF00] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4FF00]"></span>
                </span>
                The 2026 Tournament · Friend Mode
              </p>
            </div>
            
            <h1 className="animate-reveal-2 mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
              Own the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-600">
                bragging rights.
              </span>
            </h1>
            
            <p className="animate-reveal-3 mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Create a private league, predict match scores before kickoff, and assign friendly stakes like coffee, pizza, or dares. No odds. No money. Just pure ball knowledge.
            </p>
            
            <div className="animate-reveal-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <Link 
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition-all hover:scale-105 hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95" 
                href={user ? "/dashboard" : "/login"}
              >
                <Trophy size={18} className="transition-transform group-hover:-rotate-12" />
                {user ? "Open Dashboard" : "Start your league"}
              </Link>
              
            </div>
          </div>

          {/* Right Column: Floating 3D Broadcast Graphic */}
          <div className="relative z-10 mx-auto w-full max-w-md perspective-1000 lg:mx-0">
            {/* The main rotating/floating card */}
            <div 
              className="animate-float rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-500 hover:rotate-0 hover:scale-105 sm:p-8"
              style={{ opacity: 0 }} // Starts hidden, revealed by CSS keyframe
            >
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Opening Match</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">USA vs Wales</h2>
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded-lg bg-[#D4FF00] px-3 py-1 text-xs font-black uppercase text-zinc-950 shadow-[0_0_15px_rgba(212,255,0,0.4)]">Live</span>
                  <span className="mt-1 text-[10px] font-bold text-zinc-400">74:00</span>
                </div>
              </div>

              {/* The Score Duel */}
              <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 py-6 shadow-inner">
                  <div className="mb-3 h-8 w-8 overflow-hidden rounded-full border border-white/20">
                    {/* Placeholder for Avatar */}
                    <div className="h-full w-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Your Pick</p>
                  <p className="mt-1 text-4xl font-black text-white">2</p>
                </div>
                
                <p className="text-xl font-black text-white/20">VS</p>
                
                <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-black/40 py-6 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]">
                   <div className="mb-3 h-8 w-8 overflow-hidden rounded-full border border-white/20">
                    <div className="h-full w-full bg-gradient-to-tr from-orange-400 to-red-600"></div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">Dave&apos;s Pick</p>
                  <p className="mt-1 text-4xl font-black text-white">1</p>
                </div>
              </div>

              {/* The Stakes */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">On The Line</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400 shadow-sm backdrop-blur-md transition-colors hover:bg-orange-500/20">
                    <Coffee size={14} />
                    Loser Buys Coffee
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 shadow-sm backdrop-blur-md transition-colors hover:bg-white/10">
                    <ShieldCheck size={14} />
                    Private League
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}