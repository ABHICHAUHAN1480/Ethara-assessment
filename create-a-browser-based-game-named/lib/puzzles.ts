import type { Puzzle, PuzzleKind, SectorBand, TerminalCommand } from "@/types/game";

const puzzleMap: Record<SectorBand, PuzzleKind> = {
  "Syntax Bug Sector": "syntax_rebuild",
  "Logic Error Sector": "logic_contradiction",
  "Corruption Sector": "memory_sequence",
  "Recursion Sector": "recursive_stack",
  "Artificial Intelligence Sector": "prediction_model",
  "Core Intelligence Sector": "core_synthesis"
};

export function createPuzzle(id: number, band: SectorBand, level: number): Puzzle {
  const kind = puzzleMap[band];
  const seed = (id * 9301 + level * 49297) % 233280;

  if (kind === "syntax_rebuild") {
    return {
      id: `puzzle-${id}`,
      kind,
      title: "Command Grammar Rebuild",
      prompt: "Rebuild the executable command order.",
      fragments: shuffle(["scan", "repair", "stabilize"], seed),
      solution: ["scan", "repair", "stabilize"],
      requiredCommands: ["scan", "repair", "stabilize"],
      solved: false,
      attempts: 0
    };
  }

  if (kind === "logic_contradiction") {
    return {
      id: `puzzle-${id}`,
      kind,
      title: "Contradiction Isolation",
      prompt: "Find the contradiction loop and force one stable truth.",
      fragments: shuffle(["trace", "override", "stabilize"], seed),
      solution: ["trace", "override", "stabilize"],
      requiredCommands: ["trace", "override", "stabilize"],
      solved: false,
      attempts: 0
    };
  }

  if (kind === "memory_sequence") {
    return {
      id: `puzzle-${id}`,
      kind,
      title: "Archive Dump Recovery",
      prompt: "Decrypt the archive, trace the missing frame, restore memory order.",
      fragments: shuffle(["decrypt", "trace", "repair", "stabilize"], seed),
      solution: ["decrypt", "trace", "repair", "stabilize"],
      requiredCommands: ["decrypt", "trace", "repair", "stabilize"],
      solved: false,
      attempts: 0
    };
  }

  if (kind === "recursive_stack") {
    return {
      id: `puzzle-${id}`,
      kind,
      title: "Recursive Dependency Stack",
      prompt: "Trace depth, inject base case, repair return path.",
      fragments: shuffle(["trace", "inject", "repair", "stabilize"], seed),
      solution: ["trace", "inject", "repair", "stabilize"],
      requiredCommands: ["trace", "inject", "repair", "stabilize"],
      solved: false,
      attempts: 0
    };
  }

  if (kind === "prediction_model") {
    return {
      id: `puzzle-${id}`,
      kind,
      title: "Adaptive Prediction Break",
      prompt: "The AI predicts repetition. Use a varied path to desynchronize it.",
      fragments: shuffle(["scan", "inject", "decrypt", "override", "stabilize"], seed),
      solution: ["scan", "inject", "decrypt", "override", "stabilize"],
      requiredCommands: ["scan", "inject", "decrypt", "override", "stabilize"],
      solved: false,
      attempts: 0
    };
  }

  return {
    id: `puzzle-${id}`,
    kind,
    title: "Core Synthesis",
    prompt: "Combine all known repair disciplines before the Core rewrites itself.",
    fragments: shuffle(["scan", "decrypt", "trace", "inject", "repair", "override", "stabilize"], seed),
    solution: ["scan", "decrypt", "trace", "inject", "repair", "override", "stabilize"],
    requiredCommands: ["scan", "decrypt", "trace", "inject", "repair", "override", "stabilize"],
    solved: false,
    attempts: 0
  };
}

export function isTerminalCommand(value: string): value is TerminalCommand {
  return ["scan", "repair", "decrypt", "trace", "override", "stabilize", "inject"].includes(value);
}

export function evaluateCommandProgress(solution: string[], commands: string[]) {
  const recent = commands.slice(-solution.length);
  const exact = recent.length === solution.length && recent.every((command, index) => command === solution[index]);
  const nextCommand = solution[recent.filter((command, index) => command === solution[index]).length] ?? solution[0];
  const matchingPrefix = solution.filter((command, index) => recent[index] === command).length;

  return {
    exact,
    nextCommand,
    matchingPrefix
  };
}

function shuffle<T>(items: T[], seed: number) {
  const copy = [...items];
  let state = seed || 1;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const swapIndex = state % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
