/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppState, AnswerChoice, WolfArchetypeId } from "./types";
import { quizQuestions } from "./data/questions";
import { wolfArchetypes } from "./data/archetypes";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import EmailGate from "./components/EmailGate";
import ResultsScreen from "./components/ResultsScreen";
import DevDebugPanel from "./components/DevDebugPanel";

export default function App() {
  const [appState, setAppState] = useState<AppState>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [calculatedArchetype, setCalculatedArchetype] = useState<WolfArchetypeId | null>(null);
  const [userEmail, setUserEmail] = useState("");

  // Start the spiritual quest
  const handleStart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCalculatedArchetype(null);
    setAppState("quiz");
  };

  // Select an answer and proceed
  const handleSelectAnswer = (choice: AnswerChoice) => {
    const questionId = quizQuestions[currentQuestionIndex].id;
    const newAnswers = { ...answers, [questionId]: choice.archetype };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Proceed to next question screen
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // End reached — perform precise scoring logic before changing state
      const finalArchetypeId = runScoringEngine(newAnswers);
      setCalculatedArchetype(finalArchetypeId);
      
      // Move to email gate
      setAppState("email_gate");
    }
  };

  // Reverse back to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Full dynamic tie-breaker scoring calculation
  const runScoringEngine = (completedAnswers: Record<number, "A" | "B" | "C" | "D">): WolfArchetypeId => {
    const counts: Record<"A" | "B" | "C" | "D", number> = { A: 0, B: 0, C: 0, D: 0 };

    // Register simple choice frequencies
    Object.values(completedAnswers).forEach((archetype) => {
      counts[archetype] = (counts[archetype] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));

    // Find all tied archetypes sharing this peak frequency
    const tiedArchetypes = (["A", "B", "C", "D"] as const).filter(
      (key) => counts[key] === maxCount
    );

    // Single winner
    if (tiedArchetypes.length === 1) {
      return tiedArchetypes[0];
    }

    // Tie-Breaker One: Most emotionally intense selected response patterns
    const intensitySums: Record<"A" | "B" | "C" | "D", number> = { A: 0, B: 0, C: 0, D: 0 };
    quizQuestions.forEach((q) => {
      const selectedArch = completedAnswers[q.id];
      if (selectedArch) {
        const choice = q.choices.find((c) => c.archetype === selectedArch);
        if (choice) {
          intensitySums[selectedArch] += choice.intensity;
        }
      }
    });

    const tiedWithIntensities = tiedArchetypes.map((archetype) => ({
      archetype,
      intensity: intensitySums[archetype],
    }));

    const maxIntensity = Math.max(...tiedWithIntensities.map((item) => item.intensity));
    const tiedAfterIntensity = tiedWithIntensities.filter((item) => item.intensity === maxIntensity);

    // Single intensity winner
    if (tiedAfterIntensity.length === 1) {
      return tiedAfterIntensity[0].archetype;
    }

    // Tie-Breaker Two: Last selected response dictates the outcome
    for (let i = quizQuestions.length - 1; i >= 0; i--) {
      const questionId = quizQuestions[i].id;
      const val = completedAnswers[questionId];
      if (val && tiedAfterIntensity.some((item) => item.archetype === val)) {
        return val;
      }
    }

    // Ultimate insurance fallback
    return tiedAfterIntensity[0].archetype;
  };

  // Submit and reveal final result page
const handleUnlockResult = async (email: string) => {
  setUserEmail(email);

  try {
    await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        archetype: calculatedArchetype
      })
    });
  } catch (error) {
    console.error("Klaviyo error:", error);
  }

  setAppState("results");
};

  // Restart Quiz
  const handleReset = () => {
    setAppState("intro");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCalculatedArchetype(null);
    setUserEmail("");
  };

  return (
    <div id="spirit-wolf-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-start">
      <AnimatePresence mode="wait">
        {appState === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-grow flex flex-col"
          >
            <IntroScreen onStart={handleStart} />
          </motion.div>
        )}

        {appState === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-grow flex flex-col"
          >
            <QuizScreen
              questions={quizQuestions}
              currentQuestionIndex={currentQuestionIndex}
              onSelectAnswer={handleSelectAnswer}
              onPrevQuestion={handlePrevQuestion}
            />
          </motion.div>
        )}

        {appState === "email_gate" && (
          <motion.div
            key="email_gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-grow flex flex-col"
          >
            <EmailGate onUnlock={handleUnlockResult} calculatedArchetype={calculatedArchetype} />
          </motion.div>
        )}

        {appState === "results" && calculatedArchetype && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex-grow flex flex-col"
          >
            <ResultsScreen
              archetype={wolfArchetypes[calculatedArchetype]}
              userEmail={userEmail}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer State Control Overlays */}
      <DevDebugPanel
        appState={appState}
        setAppState={setAppState}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        calculatedArchetype={calculatedArchetype}
        setCalculatedArchetype={setCalculatedArchetype}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        answers={answers}
        setAnswers={setAnswers}
        onReset={handleReset}
      />
    </div>
  );
}
