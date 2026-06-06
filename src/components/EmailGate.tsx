/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface EmailGateProps {
  onUnlock: (email: string) => void;
  calculatedArchetype?: string | null;
}

export default function EmailGate({ onUnlock, calculatedArchetype }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Dynamic simple validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email to proceed.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct call to our backend API proxy for Klaviyo
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: trimmedEmail,
          archetype: calculatedArchetype || null
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.warn("Proxy registration alert:", result.message || "Generic failure");
        // We gracefully proceed even if the backend is unavailable so the user gets their result.
      }
    } catch (err) {
      console.error("Local network subscription warning:", err);
      // Fail gracefully so user experiences no disruption
    } finally {
      setIsSubmitting(false);
      onUnlock(trimmedEmail);
    }
  };

  return (
    <div
      id="email-gate-container"
      className="relative min-h-screen flex flex-col justify-center items-center text-white px-6 py-12 select-none overflow-hidden"
    >
      {/* Background with Dark Forest Theme */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/misty_wolf_forest_1780419713614.png"
          alt="Atmospheric Mist Forest"
          className="w-full h-full object-cover blur-sm brightness-[0.22] scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-teal-950/20 to-zinc-950/60" />
      </div>

      {/* Main Form container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-zinc-900/80 hover:bg-zinc-900/90 border border-zinc-805 p-8 sm:p-10 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col items-center text-center transition-colors"
      >
        {/* Soft magical beacon */}
        <div className="w-16 h-16 rounded-full bg-[#849137]/10 border border-[#849137]/40 flex items-center justify-center mb-6 shadow-lg shadow-[#849137]/20 relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#f9d440]/10 pointer-events-none"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <Lock className="w-6 h-6 text-[#f9d440]" />
        </div>

        {/* Content Headlines */}
        <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white mb-3">
          Unlock Your <br className="xs:hidden" />
          <span className="bg-gradient-to-r from-[#849137] to-[#f9d440] bg-clip-text text-transparent">
            Spirit Wolf Result 🐺
          </span>
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
          Enter your email below to connect with your spirit wolf and discover your true destined role in the pack hierarchy.
        </p>

        {/* Capturing Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="example@yourdomain.com"
              className="w-full h-13 pl-12 pr-4 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-[#849137] focus:ring-1 focus:ring-[#849137]/45 text-white font-sans text-base transition-all placeholder:text-zinc-650 outline-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Validation Error Message */}
          {error && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-rose-400 text-xs font-mono px-1.5 py-0.5 justify-start text-left"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Unlock Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 bg-gradient-to-r from-[#849137] to-[#f9d440] hover:brightness-110 text-zinc-950 rounded-xl font-sans text-md font-extrabold tracking-wider shadow-[0_4px_25px_rgba(132,145,55,0.25)] transition-all duration-300 flex items-center justify-center gap-2 border border-[#f9d440]/10 uppercase cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Unlocking Spirit Wolf Results...</span>
              </div>
            ) : (
              <>
                <span>Unlock Spirit Wolf Results</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </>
            )}
          </button>
        </form>

        {/* Small Trust Disclaimer (Klaviyo consent / Privacy) */}
        <p className="text-zinc-500 text-[10px] font-sans tracking-wide leading-relaxed mt-6">
          We protect your privacy. By submitting, you join the <b>WIAH Pack</b> to receive exclusive conservation stories, wildlife insights, and recovery efforts. Cancel anytime.
        </p>
      </motion.div>

      {/* Decorative conservation value marker */}
      <div className="relative z-10 text-center w-full max-w-md mx-auto py-4 mt-6">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.25em] font-mono flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-800/80" /> Authentic gray wolf recovery network.
        </p>
      </div>
    </div>
  );
}
