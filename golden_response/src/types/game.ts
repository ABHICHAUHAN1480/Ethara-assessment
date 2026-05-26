export type GameScreen =
  | "boot"
  | "intro"
  | "mainframe"
  | "sector"
  | "settings"
  | "achievements"
  | "warning"
  | "final";

export type SectorBandId = "syntax" | "logic" | "corruption" | "recursion" | "intelligence" | "core";

export type PuzzleKind =
  | "syntax-repair"
  | "logic-sequence"
  | "memory-restore"
  | "recursion-trace"
  | "ai-predict"
  | "core-synthesis";

export type TerminalCommandName = "scan" | "decrypt" | "repair" | "trace" | "stabilize" | "override" | "inject" | "help" | "clear" | "status";

export interface SectorBand {
  id: SectorBandId;
  title: string;
  range: [number, number];
  theme: string;
  mechanic: string;
  visual: string;
  accent: string;
  secondary: string;
  puzzleKinds: PuzzleKind[];
}

export interface SectorLevel {
  id: number;
  bandId: SectorBandId;
  title: string;
  anomaly: string;
  corruption: number;
  stabilityTarget: number;
  unlockCommand?: TerminalCommandName;
  puzzle: PuzzleDefinition;
}

export interface PuzzleDefinition {
  id: string;
  kind: PuzzleKind;
  prompt: string;
  payload: string[];
  answer: string;
  hint: string;
}

export interface TerminalEntry {
  id: string;
  type: "input" | "system" | "ai" | "error" | "success";
  text: string;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: number;
}

export interface SettingsState {
  graphics: "low" | "balanced" | "ultra";
  reducedMotion: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  scanlines: boolean;
}

export interface SaveData {
  version: 1;
  level: number;
  unlockedLevel: number;
  restoredLevels: number[];
  unlockedCommands: TerminalCommandName[];
  achievements: Achievement[];
  aiEvolution: number;
  corruption: number;
  settings: SettingsState;
  savedAt: number;
}
