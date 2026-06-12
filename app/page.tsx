"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { 
  ChevronRight, Users, Calendar, Globe 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function FIFA2026Landing() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Animation Variants ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const floatVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white selection:bg-yellow-500/30 overflow-x-hidden font-sans">
      
      {/* Background Image & Overlay - FIXED SYNTAX HERE */}
      <div 
        className="fixed inset-0 z-0 bg-[url('/images/image-copy.png')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0E17]/80 to-[#0A0E17]" />

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        
        {/* HERO SECTION */}
        <main className="flex-1 px-4 pb-12 pt-10 lg:px-12 lg:pt-16">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-[1400px]"
          >
            <div className="grid items-center gap-12 lg:grid-cols-2">
              
              {/* Left: Hero Copy */}
              <div className="flex flex-col items-start z-10">
                <motion.h1 variants={itemVariants} className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                  Predict the <br />
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
                    World Cup.
                  </span><br />
                  Rule Your League.
                </motion.h1>
                
                <motion.p variants={itemVariants} className="mt-6 max-w-lg text-lg text-slate-400">
                  Join fans around the world in the ultimate prediction challenge. Make your picks, earn points, and climb to the top.
                </motion.p>
                
                <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-4">
                  <Link href="/login" className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-sm transition-colors duration-150 hover:from-yellow-300 hover:to-yellow-500 active:scale-[0.98]">
                    Join Now
                    <ChevronRight size={18} />
                  </Link>
                  <a href="#how-it-works" className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/50 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-colors duration-150 hover:bg-white/10 active:scale-[0.98]">
                    Learn More
                  </a>
                </motion.div>
              </div>

              {/* Right: Trophy Graphic */}
              {/* Right: Trophy Graphic */}
              <motion.div variants={itemVariants} className="relative flex justify-center mt-12 lg:mt-0">
                {/* The "26" Background Text - Now responsive! */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 text-[12rem] md:text-[18rem] lg:text-[24rem] font-black leading-none text-transparent opacity-10 pointer-events-none select-none" 
                  style={{ WebkitTextStroke: '2px rgba(59, 130, 246, 0.8)' }}
                >
                  26
                </div>
                
                {/* The Trophy Image - Adjusted height for mobile */}
                <motion.div variants={floatVariants} initial="initial" animate="animate" className="relative z-10 h-[300px] sm:h-[400px] lg:h-[500px] w-full max-w-[300px] lg:max-w-[400px]">
                  <Image
                    src="/images/image.png" 
                    alt="World Cup Trophy"
                    fill
                    className="object-contain drop-shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                    priority
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* STATS BAR */}
            <motion.div variants={itemVariants} className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-sm backdrop-blur-xl lg:flex-row lg:px-10">
              <div className="flex w-full flex-wrap justify-around gap-8 lg:w-auto lg:justify-start lg:gap-12">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-black leading-none text-white">48</p>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-1">TEAMS</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-black leading-none text-white">104</p>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-1">MATCHES</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-black leading-none text-white">3</p>
                      <div className="flex gap-1">
                        <span className="h-4 w-6 rounded-[2px] bg-blue-600"></span>
                        <span className="h-4 w-6 rounded-[2px] bg-red-600"></span>
                        <span className="h-4 w-6 rounded-[2px] bg-green-600"></span>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-1">HOST COUNTRIES</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HOW IT WORKS SECTION */}
            <motion.div 
              id="how-it-works"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mt-24 pb-20"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">How It Works</h2>
                <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">Three simple steps to dominate your friend group and claim the ultimate bragging rights.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-150 hover:border-yellow-500/30 hover:bg-white/10 shadow-sm">
                  <div className="absolute -top-6 left-8 h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl font-black text-slate-950 shadow-sm">1</div>
                  <h3 className="text-2xl font-bold text-white mt-4 mb-3">Join a League</h3>
                  <p className="text-slate-400 leading-relaxed">Got an invite code? Paste it in and instantly join your friends&apos; or colleagues&apos; private tournament arena.</p>
                </div>
                
                {/* Step 2 */}
                <div className="relative group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-150 hover:border-blue-500/30 hover:bg-white/10 shadow-sm">
                  <div className="absolute -top-6 left-8 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl font-black text-white shadow-sm">2</div>
                  <h3 className="text-2xl font-bold text-white mt-4 mb-3">Lock Predictions</h3>
                  <p className="text-slate-400 leading-relaxed">Analyze the matchups and lock in your exact score predictions before the whistle blows for all 104 matches.</p>
                </div>
                
                {/* Step 3 */}
                <div className="relative group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-150 hover:border-green-500/30 hover:bg-white/10 shadow-sm">
                  <div className="absolute -top-6 left-8 h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl font-black text-white shadow-sm">3</div>
                  <h3 className="text-2xl font-bold text-white mt-4 mb-3">Climb & Win</h3>
                  <p className="text-slate-400 leading-relaxed">Earn points for correct results and perfect scores. Climb the live leaderboard and win those friendly stakes.</p>
                </div>
              </div>

              <div className="mt-16 flex justify-center">
                 <Link href="/login" className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-10 py-4 text-base font-bold text-slate-950 shadow-sm transition-colors duration-150 hover:from-yellow-300 hover:to-yellow-500 active:scale-[0.98]">
                    Start Playing Now
                    <ChevronRight size={20} />
                  </Link>
              </div>
            </motion.div>

          </motion.div>
        </main>
        
        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  );
}
