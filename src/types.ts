/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnswerChoice {
  text: string;
  archetype: "A" | "B" | "C" | "D"; // A=Guardian, B=Trailblazer, C=Visionary, D=Soul
  intensity: number; // Emotional intensity score for tie-breaking
}

export interface Question {
  id: number;
  questionText: string;
  choices: AnswerChoice[];
}

export type WolfArchetypeId = "A" | "B" | "C" | "D";

export interface RealWolfInfo {
  name: string;
  image: string;
  story: string; // 2-5 sentences emotional story focused on meaning/survival/instinct/leadership
}

export interface ArchetypeDetails {
  id: WolfArchetypeId;
  name: string;
  emoji: string;
  title: string;
  description: string; // emotionally powerful identity description
  realWolf: RealWolfInfo;
  mirrorParagraph: string; // personalized "Why You Are This Wolf" mirror paragraph
}

export type AppState = "intro" | "quiz" | "email_gate" | "results";
