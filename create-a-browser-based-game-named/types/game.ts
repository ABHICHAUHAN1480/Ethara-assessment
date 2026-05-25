export type Screen = "boot" | "intro" | "mainframe" | "sector";

export type TerminalCommand = "scan" | "repair" | "decrypt" | "trace" | "override" | "stabilize" | "inject";

export type SectorBand =
  | "Syntax Bug Sector"
  | "Logic Error Sector"
  | "Corruption Sector"
  | "Recursion Sector"
  | "Artificial Intelligence Sector"
  | "Core Intelligence Sector";

export type AIMood = "curious" | "hostile" | "afraid" | "analytical" | "unstable" | "quiet";

export type PuzzleKind =
  | "syntax_rebuild"
  | "logic_contradiction"
  | "memory_sequence"
  | "recursive_stack"
  | "prediction_model"
  | "core_synthesis";

export type Puzzle = {
  id: string;
  kind: PuzzleKind;
  title: string;
  prompt: string;
  fragments: string[];
  solution: string[];
  requiredCommands: TerminalCommand[];
  solved: boolean;
  attempts: number;
};

export type Sector = {
  id: number;
  name: string;
  band: SectorBand;
  levelRange: [number, number];
  theme: string;
  aiName: string;
  aiMood: AIMood;
  corruption: number;
  stability: number;
  aiPresence: number;
  objectives: string[];
  unlocked: boolean;
  restored: boolean;
  activity: string;
  puzzle: Puzzle;
};

export type Achievement = {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
  timestamp?: number;
};

export type GameSettings = {
  music: boolean;
  sfx: boolean;
  subtitles: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  colorblindMode: boolean;
  graphics: "eco" | "balanced" | "ultra";
  uiScale: number;
  keyboardControls: boolean;
};

export type TerminalLine = {
  id: string;
  type: "input" | "system" | "warning" | "success" | "ai";
  text: string;
  timestamp: number;
};

export type SavePayload = {
  version: number;
  currentSectorId: number;
  restoredSectors: number[];
  unlockedSectorId: number;
  totalRestored: number;
  achievements: Achievement[];
  settings: GameSettings;
  commandHistory: string[];
  storyFlags: Record<string, boolean>;
  lastSavedAt: number;
};
