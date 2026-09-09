/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Compass, Sparkles } from "lucide-react";
import { Question, AnswerChoice } from "../types";
import ProgressBar from "./ProgressBar";

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  onSelectAnswer: (choice: AnswerChoice) => void;
  onPrevQuestion: () => void;
}

export default function QuizScreen({
  questions,
  currentQuestionIndex,
  onSelectAnswer,
  onPrevQuestion,
}: QuizScreenProps) {
  const currentQuestion = questions[currentQuestionIndex] || questions[questions.length - 1] || questions[0];
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleSelect = (choice: AnswerChoice, label: string) => {
    if (selectedLetter !== null) return;
    setSelectedLetter(label);
    // Add small delay so user visualizes active selection state
    setTimeout(() => {
      onSelectAnswer(choice);
      setSelectedLetter(null);
    }, 450);
  };

  // Assign letters A, B, C, D representing choices
  const letters = ["A", "B", "C", "D"];

  return (
    <div
      id="quiz-screen-container"
      className="relative min-h-screen py-8 px-5 flex flex-col justify-between text-zinc-100 bg-zinc-950 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-teal-950/20 via-zinc-950/0 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-emerald-950/15 via-zinc-950/0 to-transparent pointer-events-none" />

      {/* Header with progress and optional back arrow */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between w-full">
          {currentQuestionIndex > 0 ? (
            <button
              onClick={onPrevQuestion}
              className="flex items-center gap-1 text-sm font-mono uppercase tracking-wider text-zinc-400 hover:text-[#f9d440] transition-colors py-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="w-10 h-8" /> /* balance spacing */
          )}

          <div className="flex items-center gap-1.5 text-zinc-450 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-[#f9d440] animate-spin" style={{ animationDuration: "20s" }} />
            <span>WIAH Spirit Wolf Quiz</span>
          </div>
        </div>

        {/* Progress bar info */}
        <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
      </div>

      {/* Animated Question Body Container */}
      <div className="relative z-10 flex-grow w-full max-w-lg mx-auto flex flex-col justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="flex flex-col gap-6"
          >
            {/* Question Text */}
            <div className="px-1">
              <span className="text-[#849137] font-mono text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
                Inner Voice
              </span>
              <h2 className="text-xl sm:text-2xl font-sans font-extrabold tracking-tight text-white leading-snug">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Answer Cards Grid */}
            <div className="flex flex-col gap-3.5 mt-2">
              {currentQuestion.choices.map((choice, idx) => {
                const label = letters[idx];
                const isSelected = selectedLetter === label;

                return (
                  <motion.button
                    key={`${currentQuestion.id}-${label}`}
                    disabled={selectedLetter !== null}
                    onClick={() => handleSelect(choice, label)}
                    whileHover={selectedLetter !== null ? {} : { scale: 1.01 }}
                    whileTap={selectedLetter !== null ? {} : { scale: 0.99 }}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden flex items-start gap-4 cursor-pointer sm:min-h-[72px] ${
                      isSelected
                        ? "bg-[#849137]/15 border-[#849137] shadow-[0_0_15px_rgba(132,145,55,0.35)] text-white"
                        : "bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 text-zinc-200"
                    }`}
                  >
                    {/* Letter Indicator badge */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-black transition-all ${
                        isSelected
                          ? "bg-[#f9d440] text-zinc-950 shadow-[0_0_8px_rgba(249,212,64,0.5)]"
                          : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                      }`}
                    >
                      {label}
                    </div>

                    {/* Choice Text */}
                    <p className="font-sans text-sm sm:text-base tracking-wide leading-relaxed pt-1 flex-grow">
                      {choice.text}
                    </p>

                    {/* Selected Overlay Effect */}
                    {isSelected && (
                      <motion.div
                        layoutId="active-selection-glow"
                        className="absolute inset-0 border-r-4 border-[#f9d440] pointer-events-none"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative nature reference footer */}
      <div className="relative z-10 text-center w-full max-w-lg mx-auto py-2">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.25em] font-mono flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-emerald-900" /> Choose the option that resonates with your core truth.
        </p>
      </div>
    </div>
  );
}
