/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div
      id="intro-screen-container"
      className="relative min-h-screen flex flex-col items-center justify-between text-white overflow-hidden px-6 py-12 select-none"
    >
      {/* Cinematic Forest Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/misty_wolf_forest_1780419713614.png"
          alt="Misty Forest"
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
      </div>

      {/* Subtle Drift Fog Layer */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none opacity-20 mix-blend-color-dodge"
        animate={{
          x: ["0%", "-10%", "0%"],
          y: ["0%", "5%", "0%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Brand Header */}
      <motion.div
        id="intro-brand-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-1.5 mt-4"
      >
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#f9d440] font-bold bg-[#849137]/20 px-4 py-1.5 rounded-full border border-[#849137]/45">
          WIAH RETURN TO YOUR PACK
        </span>
      </motion.div>

      {/* Main Content Card Container */}
      <div className="relative z-10 max-w-md w-full flex-grow flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="flex flex-col items-center"
        >
          {/* Decorative wolf emblem/icon */}
          <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-850 flex items-center justify-center mb-6 shadow-xl backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-[#f9d440] animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-sans font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
            Which is Your <br />
            <span className="bg-gradient-to-r from-[#849137] to-[#f9d440] bg-clip-text text-transparent italic">
              Spirit Wolf?
            </span>
          </h1>

          <p className="text-zinc-350 font-sans text-base sm:text-lg tracking-wide max-w-xs sm:max-w-sm mb-8 leading-relaxed">
            Discover your spirit wolf archetype and reveal the essential role you play in the pack.
          </p>
        </motion.div>
      </div>

      {/* Call to action section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4 mt-auto"
      >
        <button
          id="btn-start-quiz"
          onClick={onStart}
          className="w-full h-14 bg-gradient-to-r from-[#849137] to-[#f9d440] hover:brightness-110 rounded-xl font-sans text-base font-bold tracking-wider shadow-[0_4px_20px_rgba(132,145,55,0.3)] min-h-[56px] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 border border-[#f9d440]/10 text-zinc-950 uppercase cursor-pointer"
        >
          Start Spirit Quiz
          <ArrowRight className="w-5 h-5 text-zinc-950" />
        </button>

        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-1">
          9 Questions
        </p>
      </motion.div>
    </div>
  );
}
