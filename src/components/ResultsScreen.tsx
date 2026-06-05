/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Mail, Check, Heart, Sparkles, AlertCircle, Compass } from "lucide-react";
import { ArchetypeDetails } from "../types";

interface ResultsScreenProps {
  archetype: ArchetypeDetails;
  userEmail: string;
  onReset: () => void;
}

export default function ResultsScreen({ archetype, userEmail, onReset }: ResultsScreenProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const shareText = `🐺 My Spirit Wolf is the ${archetype.name} (${archetype.title})! I am connected to real Mexican gray ${archetype.realWolf.name}. Discover yours at Which is Your Spirit Wolf!`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Which is Your Spirit Wolf?",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        triggerFeedback();
      }
    } catch (err) {
      // Fallback copy if sharing got cancelled or permission restriction hit
      try {
        await navigator.clipboard.writeText(shareText);
        triggerFeedback();
      } catch (clipErr) {
        setFeedback("Please copy this text manually: " + shareText);
      }
    }
  };

  const triggerFeedback = () => {
    setCopied(true);
    setFeedback("Spirit results copied to clipboard! Share on social media.");
    setTimeout(() => {
      setCopied(false);
      setFeedback(null);
    }, 4000);
  };

  return (
    <div
      id="results-screen-container"
      className="relative min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center bg-zinc-950 text-zinc-100 overflow-x-hidden"
    >
      {/* Dynamic Background gradient overlays */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#849137]/10 via-zinc-950/0 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#f9d440]/5 via-zinc-950/0 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col gap-8 pb-16">
        {/* Top Mini Header */}
        <div className="flex flex-col items-center text-center gap-1">
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#f9d440] font-bold bg-[#849137]/20 px-4 py-1.5 rounded-full border border-[#849137]/45">
            Spirit Wolf Revealed
          </span>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-2.5">
            Aligned for: {userEmail}
          </p>
        </div>

        {/* 1. Identity Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
        >
          <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(249,212,64,0.3)] mb-3 block">
            {archetype.emoji}
          </span>
          <h1 className="text-zinc-450 font-mono text-xs font-bold uppercase tracking-[0.25em] mb-1.5">
            Your Spirit Wolf is the
          </h1>
          <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-white mb-2">
            {archetype.name}
          </h2>
          <p className="text-[#f9d440] font-sans font-semibold tracking-wide italic text-base sm:text-lg mb-4">
            {archetype.title}
          </p>
          <div className="w-16 h-[2px] bg-[#849137]/50 mx-auto mb-5 rounded-full" />
          <p className="text-zinc-200 font-sans text-sm sm:text-base leading-relaxed tracking-wide max-w-md mx-auto">
            {archetype.description}
          </p>
        </motion.div>

        {/* 2. Assigned Real Wolf Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Real Wolf Image block */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden group">
            <img
              src={archetype.realWolf.image}
              alt={archetype.realWolf.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent" />
            
            {/* Tag in corner */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-1.5 shadow-lg">
              <Compass className="w-4 h-4 text-[#f9d440] animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-350 uppercase tracking-wider font-bold">
                Assigned Ambassador
              </span>
            </div>

            {/* Wolf Name Overlay */}
            <div className="absolute bottom-4 left-6">
              <span className="text-xs uppercase font-mono text-[#f9d440] tracking-widest font-bold">
                {/8|907|901/i.test(archetype.realWolf.name) ? "Real Wolf" : "Real Mexican Gray Wolf"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white">
                {archetype.realWolf.name}
              </h3>
            </div>
          </div>

          {/* Wolf Story Info */}
          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <HistoryIndicator />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                Historical Story of Survival
              </span>
            </div>

            <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed tracking-wide italic p-3 bg-zinc-950/40 border-l-2 border-[#849137]/65 rounded-r-lg">
              &ldquo;{archetype.realWolf.story}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* 3. Why You Are This Wolf Personal Mirror */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-b from-zinc-900 to-zinc-900/80 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#f9d440]" />
            <h4 className="text-xs uppercase font-mono text-[#f9d440] tracking-wider font-extrabold">
              Personal Reflection • Why You Are This Wolf
            </h4>
          </div>

          <p className="text-zinc-250 font-sans text-sm sm:text-[15px] leading-relaxed tracking-wide">
            {archetype.mirrorParagraph}
          </p>
        </motion.div>

        {/* 4. WIAH Bridge Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="relative bg-[#849137]/10 border border-[#849137]/30 p-6 sm:p-8 rounded-2xl overflow-hidden shadow-md flex flex-col gap-4"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="w-16 h-16 text-[#f9d440]" />
          </div>

          <div>
            <h5 className="text-[11px] font-mono uppercase text-[#f9d440] tracking-[0.2em] font-extrabold mb-2.5">
              The WIAH Conservation Vision
            </h5>

            <div className="text-zinc-300 font-sans text-sm leading-relaxed flex flex-col gap-4">
              <p>
                At WIAH, we believe nature is not separate from us. We are one living pack, shared with the wolves and the wild places they depend on.
              </p>
              <p>
                Mexican gray wolves once numbered in the hundreds of thousands. Today, only 241 remain in the wild in the United States.
                As a keystone species, wolves help keep entire ecosystems in balance. When they disappear, the natural world changes with them.
              </p>
              <p>
                At WIAH, we create compostable products from corn and support efforts to restore Mexican gray wolves: not just to protect them, but to help bring them home to the wild where they belong.
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#849137]/25 my-1" />

          <div className="flex flex-col gap-2.5">
            <h6 className="text-[11px] font-mono uppercase text-[#f9d440] tracking-widest font-black flex items-center gap-1.5">
              🐺 Welcome to the Pack
            </h6>
            <ul className="list-disc list-inside text-zinc-350 text-xs sm:text-xs flex flex-col gap-2 pl-1 whitespace-pre-wrap leading-relaxed">
              <li>Share your wolf with someone who feels like part of your pack</li>
              <li>
                Follow Instagram{" "}
                <a
                  href="https://instagram.com/hellowiah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f9d440] hover:underline font-bold"
                >
                  @hellowiah
                </a>{" "}
                to stay connected to the pack and deepen your connection to your spirit wolf
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Floating feedback message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 inset-x-4 max-w-sm mx-auto z-50 bg-zinc-900/95 border border-[#849137] text-white p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-start gap-3"
            >
              {copied ? (
                <Check className="w-5 h-5 text-[#f9d440] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-sans tracking-wide leading-relaxed">{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Final CTA Action Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col gap-4 mt-2"
        >
          <button
            onClick={handleShare}
            className="w-full h-13 bg-gradient-to-r from-[#849137] to-[#f9d440] hover:brightness-110 text-zinc-950 rounded-xl font-sans text-sm font-black tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 uppercase shadow-xl cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-zinc-950" />
            Share Your Wolf 🐺
          </button>
        </motion.div>

        {/* Retake Button */}
        <button
          onClick={onReset}
          className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-[#f9d440] transition-colors mx-auto mt-6 py-2 cursor-pointer"
        >
          ✦ Retake Spirit Quiz ✦
        </button>
      </div>
    </div>
  );
}

// Sparkle/Visual support helper indicators
function HistoryIndicator() {
  return (
    <div className="w-1.5 h-1.5 rounded-full bg-[#f9d440] shadow-[0_0_8px_rgba(249,212,64,0.6)]" />
  );
}
