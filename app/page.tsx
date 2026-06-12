"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Globe, Users, Zap } from "lucide-react";

export default function FIFA2026Landing() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  const floatVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] rounded-full bg-red-600/20 blur-[120px]"></div>
        <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#D4FF00]/5 blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10 md:py-20"
      >
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF00] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4FF00]"></span>
              </span>
              FIFA World Cup 2026
            </span>
          </motion.div>

          {/* Trophy Image - Floating Animation */}
          <motion.div
            variants={itemVariants}
            className="my-8 md:my-12"
          >
            <motion.div
              variants={floatVariants}
              initial="initial"
              animate="animate"
              className="flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src="/images/image.png"
                  alt="FIFA World Cup Trophy 2026"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-4 mb-6 md:mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Your League.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4FF00] via-lime-300 to-[#D4FF00] animate-pulse">
                Your Rules.
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Predict scores, challenge friends, and claim bragging rights during the 2026 World Cup. 
            No money. No odds. Just pure football knowledge.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-[#D4FF00] text-zinc-950 font-bold rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg hover:shadow-[0_0_30px_rgba(212,255,0,0.5)]"
            >
              Create Your League
              <span className="absolute inset-0 rounded-xl bg-[#D4FF00] opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Link>
            <Link
              href="/matches"
              className="px-8 py-4 border border-zinc-700 text-white font-bold rounded-xl hover:border-[#D4FF00] hover:bg-zinc-900/50 transition-all"
            >
              View Schedule
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-12 mb-16"
          >
            {[
              {
                icon: <Globe size={24} />,
                title: "Live Matches",
                desc: "Track every 2026 World Cup game",
              },
              {
                icon: <Users size={24} />,
                title: "Private Leagues",
                desc: "Invite friends and compete",
              },
              {
                icon: <Zap size={24} />,
                title: "Friendly Stakes",
                desc: "Coffee, pizza, or bragging rights",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group rounded-lg border border-white/5 bg-white/5 backdrop-blur p-6 hover:border-[#D4FF00]/50 hover:bg-white/10 transition-all"
              >
                <div className="text-[#D4FF00] mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Colorful Background Card */}
          <motion.div
            variants={itemVariants}
            className="w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl mt-12"
          >
            
          </motion.div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <p className="text-zinc-500 text-sm mb-4">
            Ready to dominate your friend group?
          </p>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 300 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#D4FF00] text-[#D4FF00] font-bold hover:bg-[#D4FF00] hover:text-zinc-950 transition-all"
            >
              Start Now
              <span>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile Bottom Padding */}
      <div className="h-10 md:h-0"></div>
    </div>
  );
}