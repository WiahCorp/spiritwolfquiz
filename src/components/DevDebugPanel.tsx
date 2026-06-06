/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, X, RefreshCw, Layers, Compass, HelpCircle, Check, HelpCircle as QIcon } from "lucide-react";
import { AppState, WolfArchetypeId } from "../types";
import { quizQuestions } from "../data/questions";

interface DevDebugPanelProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  calculatedArchetype: WolfArchetypeId | null;
  setCalculatedArchetype: (archetype: WolfArchetypeId | null) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  answers: Record<number, "A" | "B" | "C" | "D">;
  setAnswers: (answers: Record<number, "A" | "B" | "C" | "D">) => void;
  onReset: () => void;
}

export default function DevDebugPanel({
  appState,
  setAppState,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  calculatedArchetype,
  setCalculatedArchetype,
  userEmail,
  setUserEmail,
  answers,
  setAnswers,
  onReset,
}: DevDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Quick state presets
  const jumpToIntro = () => {
    setAppState("intro");
  };

  const jumpToQuestion = (qIndex: number) => {
    setCurrentQuestionIndex(qIndex);
    setAppState("quiz");
  };

  const jumpToEmailGate = () => {
    // Fill answers if empty to avoid broken visual states
    if (Object.keys(answers).length < quizQuestions.length) {
      const mockAnswers: Record<number, "A" | "B" | "C" | "D"> = {};
      quizQuestions.forEach((q, idx) => {
        // Distribute balanced mock options
        const options: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
        mockAnswers[q.id] = options[idx % 4];
      });
      setAnswers(mockAnswers);
    }
    setAppState("email_gate");
  };

  const jumpToResults = (forcedArchetype?: WolfArchetypeId) => {
    if (forcedArchetype) {
      setCalculatedArchetype(forcedArchetype);
    } else if (!calculatedArchetype) {
      setCalculatedArchetype("A"); // default fallbacks
    }

    if (!userEmail) {
      setUserEmail("developer.preview@hellowiah.com");
    }
    setAppState("results");
  };

  const handleSimulateRandomAnswers = () => {
    const mockAnswers: Record<number, "A" | "B" | "C" | "D"> = {};
    const options: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
    quizQuestions.forEach((q) => {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      mockAnswers[q.id] = randomOption;
    });
    setAnswers(mockAnswers);
    setCurrentQuestionIndex(quizQuestions.length - 1);
    setAppState("quiz");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-4 right-4 z-[999]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 text-amber-400 text-xs font-mono font-bold rounded-lg border border-amber-500/40 shadow-lg cursor-pointer hover:bg-zinc-800 hover:border-amber-400 transition-colors"
        >
          <Settings className={`w-4 h-4 text-amber-500 ${isOpen ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span>{isOpen ? "Close Debug Panel" : "🛠️ Debug State Panel"}</span>
        </motion.button>
      </div>

      {/* Slide-out/up Developer Tool Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.97 }}
            className="fixed bottom-16 right-4 left-4 md:left-auto md:w-96 z-[998] max-h-[80vh] overflow-y-auto bg-zinc-950/95 border border-amber-500/30 rounded-xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col gap-4 text-xs select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
                  State Engine Control
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-zinc-900 rounded text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Metrics Display */}
            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-850 font-mono text-[10px] text-zinc-400 flex flex-col gap-1">
              <div className="flex justify-between">
                <span>App Flow State:</span>
                <span className="font-bold text-teal-400 uppercase">{appState}</span>
              </div>
              <div className="flex justify-between">
                <span>Quiz Index:</span>
                <span className="font-bold text-indigo-400">Idx {currentQuestionIndex} (Q{currentQuestionIndex + 1}/9)</span>
              </div>
              <div className="flex justify-between">
                <span>Calculated Archetype:</span>
                <span className="font-bold text-amber-400">
                  {calculatedArchetype ? `${calculatedArchetype} (${calculatedArchetype === "A" ? "Guardian" : calculatedArchetype === "B" ? "Trailblazer" : calculatedArchetype === "C" ? "Visionary" : "Soul"})` : "None (Pending)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Captured Email:</span>
                <span className="font-bold text-pink-400 truncate max-w-[200px]" title={userEmail || "Unsubmitted"}>
                  {userEmail || "Unsubmitted"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Answers Picked:</span>
                <span className="font-bold text-zinc-300">
                  {Object.keys(answers).length} / 9 Choices
                </span>
              </div>
            </div>

            {/* Quick Jumps Panel */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-zinc-400 font-mono tracking-wider uppercase text-[10px]">
                ✦ Jump to App State Flow:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Intro Button */}
                <button
                  onClick={jumpToIntro}
                  className={`py-1.5 px-2 rounded font-mono text-left transition-colors flex items-center justify-between ${
                    appState === "intro"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-900 text-zinc-300 border border-transparent hover:bg-zinc-800"
                  }`}
                >
                  <span>1. Intro Screen</span>
                  {appState === "intro" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                {/* Email Gate */}
                <button
                  onClick={jumpToEmailGate}
                  className={`py-1.5 px-2 rounded font-mono text-left transition-colors flex items-center justify-between ${
                    appState === "email_gate"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-900 text-zinc-300 border border-transparent hover:bg-zinc-800"
                  }`}
                >
                  <span>3. Email Gate</span>
                  {appState === "email_gate" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Quiz Questions Jump Grid */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-zinc-400 font-mono tracking-wider uppercase text-[10px]">
                  ✦ Go direct to Quiz Q:
                </span>
                <button
                  onClick={handleSimulateRandomAnswers}
                  className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] hover:text-emerald-400 transition-all font-mono"
                >
                  🎲 Auto-fill Random
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1 font-mono">
                {quizQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToQuestion(idx)}
                    className={`py-1 rounded text-center font-bold ${
                      appState === "quiz" && currentQuestionIndex === idx
                        ? "bg-emerald-400 text-zinc-950 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Screen Jump Grid with Force Archetype choices */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-zinc-400 font-mono tracking-wider uppercase text-[10px]">
                ✦ Unlocked Results Previews:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => jumpToResults("A")}
                  className={`py-1.5 px-2 rounded font-mono text-left transition-colors flex flex-col gap-[2px] ${
                    appState === "results" && calculatedArchetype === "A"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-900 text-zinc-300 border border-transparent hover:bg-zinc-800"
                  }`}
                >
                  <span className="font-bold">🐺 Guardian (A)</span>
                  <span className="text-[9px] text-zinc-500">Wolf 907F</span>
                </button>

                <button
                  onClick={() => jumpToResults("B")}
                  className={`py-1.5 px-2 rounded font-mono text-left transition-colors flex flex-col gap-[2px] ${
                    appState === "results" && calculatedArchetype === "B"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-900 text-zinc-300 border border-transparent hover:bg-zinc-800"
                  }`}
                >
                  <span className="font-bold">🐺 Trailblazer (B)</span>
                  <span className="text-[9px] text-zinc-500">Wolf Ella</span>
                </button>

                <button
                  onClick={() => jumpToResults("C")}
                  className={`py-1.5 px-2 rounded font-mono text-left transition-colors flex flex-col gap-[2px] ${
                    appState === "results" && calculatedArchetype === "C"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-900 text-zinc-300 border border-transparent hover:bg-zinc-800"
                  }`}
                >
                  <span className="font-bold">🐺 Visionary (C)</span>
                  <span className="text-[9px] text-zinc-500">Wolf 8</span>
                </button>

                <button
                  onClick={() => jumpToResults("D")}
                  className={`py-1.5 px-2 rounded font-mono text-left transition-colors flex flex-col gap-[2px] ${
                    appState === "results" && calculatedArchetype === "D"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-900 text-zinc-300 border border-transparent hover:bg-zinc-800"
                  }`}
                >
                  <span className="font-bold">🐺 Soul (D)</span>
                  <span className="text-[9px] text-zinc-500">Wolf Taylor</span>
                </button>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="flex gap-2 border-t border-zinc-850 pt-2.5">
              <button
                onClick={onReset}
                className="flex-1 py-2 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 border border-rose-900/40 rounded flex items-center justify-center gap-1.5 transition-colors font-mono cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Full Hard Reset</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
