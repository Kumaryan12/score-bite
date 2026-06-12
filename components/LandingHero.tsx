"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { Coffee, ShieldCheck, Trophy, ArrowRight, Star } from "lucide-react";

export default function LandingHero({ user }: { user: any }) {
  // --- 3D Hover Effect Logic ---
  const boundingRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Add spring physics to the mouse movement so it feels heavy and premium
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boundingRef.current) return;
    const rect = boundingRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- Animation Variants ---
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
  };

  return (
    <section className="relative mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-32">
      
      {/* Left Column: Staggered Hero Copy */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="relative z-10"
      >
        <motion.div variants={itemVars}>
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF00] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4FF00]"></span>
            </span>
            The 2026 Tournament · Friend Mode
          </p>
        </motion.div>
        
        <motion.h1 variants={itemVars} className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
          Own the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-600">
            bragging rights.
          </span>
        </motion.h1>
        
        <motion.p variants={itemVars} className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          Create a private league, predict match scores before kickoff, and assign friendly stakes like coffee, pizza, or dares. No odds. No money. Just pure ball knowledge.
        </motion.p>
        
        <motion.div variants={itemVars} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link 
            className="group flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition-all hover:scale-105 hover:bg-zinc-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95" 
            href={user ? "/dashboard" : "/login"}
          >
            <Trophy size={18} className="transition-transform group-hover:-rotate-12" />
            {user ? "Open Dashboard" : "Start your league"}
          </Link>
          <Link 
            className="group flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-zinc-800" 
            href="/matches"
          >
            View schedule
            <ArrowRight size={16} className="text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Column: 3D Tilt Match Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.3, delay: 0.4 }}
        className="relative z-10 mx-auto w-full max-w-md perspective-[1200px] lg:mx-0"
      >
        <motion.div
          ref={boundingRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
        >
          {/* Internal elements pop out in 3D using translateZ */}
          <div style={{ transform: "translateZ(30px)" }} className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Opening Match</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">USA vs Wales</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="rounded-lg bg-[#D4FF00] px-3 py-1 text-xs font-black uppercase text-zinc-950 shadow-[0_0_15px_rgba(212,255,0,0.4)]">Live</span>
            </div>
          </div>

          <div style={{ transform: "translateZ(50px)" }} className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 py-6 shadow-inner transition-colors group-hover:border-zinc-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Your Pick</p>
              <p className="mt-1 text-4xl font-black text-white">2</p>
            </div>
            <p className="text-xl font-black text-white/20">VS</p>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-black/40 py-6 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)] transition-colors group-hover:border-red-500/40">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">Dave's Pick</p>
              <p className="mt-1 text-4xl font-black text-white">1</p>
            </div>
          </div>

          <div style={{ transform: "translateZ(20px)" }} className="mt-8 border-t border-white/5 pt-6">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">On The Line</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400 shadow-sm backdrop-blur-md">
                <Coffee size={14} />
                Loser Buys Coffee
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 shadow-sm backdrop-blur-md">
                <ShieldCheck size={14} />
                Private League
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}