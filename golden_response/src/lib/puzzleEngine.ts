import type { PuzzleDefinition } from "@/types/game";

export interface PuzzleResult {
  correct: boolean;
  normalizedAnswer: string;
  message: string;
}

export function validatePuzzleAnswer(puzzle: PuzzleDefinition, rawAnswer: string): PuzzleResult {
  const normalizedAnswer = normalize(rawAnswer);
  const expected = normalize(puzzle.answer);
  const correct = normalizedAnswer === expected;
  return {
    correct,
    normalizedAnswer,
    message: correct ? "Patch accepted. Sector stability rising." : `Patch rejected. ${puzzle.hint}`
  };
}

export function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
