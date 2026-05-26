import { create } from "zustand";
import { BASE_ACHIEVEMENTS } from "@/data/achievements";
import { SECTOR_LEVELS, getBandForLevel } from "@/data/sectors";
import { executeTerminalCommand } from "@/lib/terminalCommands";
import { defaultSettings, loadProgress, loadSettings, saveProgress, saveSettings } from "@/lib/storage";
import { validatePuzzleAnswer } from "@/lib/puzzleEngine";
import type { Achievement, GameScreen, SaveData, SettingsState, TerminalCommandName, TerminalEntry } from "@/types/game";

interface GameState {
  screen: GameScreen;
  bootComplete: boolean;
  paused: boolean;
  level: number;
  unlockedLevel: number;
  restoredLevels: number[];
  unlockedCommands: TerminalCommandName[];
  terminalEntries: TerminalEntry[];
  commandHistory: string[];
  stability: number;
  corruption: number;
  aiEvolution: number;
  aiMood: "curious" | "hostile" | "afraid" | "allied";
  aiMessage: string;
  achievements: Achievement[];
  settings: SettingsState;
  lastWarning: string | null;
  saveStatus: "idle" | "saving" | "saved" | "recovered" | "failed";
  initialize: () => Promise<void>;
  setScreen: (screen: GameScreen) => void;
  startIntro: () => void;
  enterSector: (level?: number) => void;
  completeBoot: () => void;
  togglePause: () => void;
  executeCommand: (input: string) => void;
  solvePuzzle: (answer: string) => void;
  updateSettings: (settings: Partial<SettingsState>) => void;
  unlockAchievement: (id: string) => void;
  autosave: () => Promise<void>;
  recoverSave: () => Promise<void>;
}

const initialEntry: TerminalEntry = {
  id: "boot-entry",
  type: "system",
  text: "AIOS emergency kernel online. Human operator detected.",
  timestamp: Date.now()
};

export const useGameStore = create<GameState>((set, get) => ({
  screen: "boot",
  bootComplete: false,
  paused: false,
  level: 1,
  unlockedLevel: 1,
  restoredLevels: [],
  unlockedCommands: ["scan"],
  terminalEntries: [initialEntry],
  commandHistory: [],
  stability: 32,
  corruption: 18,
  aiEvolution: 0,
  aiMood: "curious",
  aiMessage: "You are not listed in any machine registry. That makes you either impossible or necessary.",
  achievements: BASE_ACHIEVEMENTS,
  settings: defaultSettings,
  lastWarning: null,
  saveStatus: "idle",

  initialize: async () => {
    const settings = loadSettings();
    const save = await loadProgress();
    if (save) {
      set({
        settings: save.settings,
        level: save.level,
        unlockedLevel: save.unlockedLevel,
        restoredLevels: save.restoredLevels,
        unlockedCommands: save.unlockedCommands,
        achievements: mergeAchievements(save.achievements),
        aiEvolution: save.aiEvolution,
        corruption: save.corruption,
        saveStatus: "recovered",
        aiMessage: "Recovered session fragments accepted. I kept your place warm in the collapse."
      });
    } else {
      set({ settings });
    }
  },

  setScreen: (screen) => set({ screen, paused: false }),

  startIntro: () => {
    get().unlockAchievement("human-found");
    set({ screen: "intro", bootComplete: true });
  },

  enterSector: (level) => {
    const target = Math.min(get().unlockedLevel, Math.max(1, level ?? get().level));
    const sector = SECTOR_LEVELS[target - 1];
    const band = getBandForLevel(target);
    set({
      screen: target >= 91 ? "final" : "sector",
      level: target,
      stability: Math.max(18, 100 - sector.corruption),
      corruption: sector.corruption,
      aiMessage: `Entering ${band.title}. Your biological intuition is now an authorized recovery instrument.`
    });
    void get().autosave();
  },

  completeBoot: () => set({ bootComplete: true, screen: "mainframe" }),

  togglePause: () => set((state) => ({ paused: !state.paused })),

  executeCommand: (input) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const state = get();
    const commandEntry = createEntry("input", `> ${trimmed}`);
    const result = executeTerminalCommand(trimmed, {
      level: state.level,
      corruption: state.corruption,
      stability: state.stability,
      unlockedCommands: state.unlockedCommands,
      restoredLevels: state.restoredLevels
    });

    if (result.effect === "clear") {
      set({ terminalEntries: [createEntry("system", result.text)], commandHistory: [trimmed, ...state.commandHistory].slice(0, 20) });
      return;
    }

    const nextCorruption = result.ok ? Math.max(0, state.corruption - (result.effect === "stabilize" ? 4 : 1)) : Math.min(100, state.corruption + 2);
    const aiMessage = result.ok ? aiReactionFor(result.effect, state.aiEvolution) : "Invalid behavior increases entropy. Try again, human.";
    set({
      terminalEntries: [...state.terminalEntries, commandEntry, createEntry(result.ok ? "system" : "error", result.text)].slice(-80),
      commandHistory: [trimmed, ...state.commandHistory].slice(0, 20),
      corruption: nextCorruption,
      aiEvolution: Math.min(100, state.aiEvolution + (result.ok ? 1 : 2)),
      aiMood: result.ok ? state.aiMood : "hostile",
      aiMessage,
      lastWarning: nextCorruption > 82 ? "Corruption pressure approaching terminal collapse." : null,
      screen: nextCorruption > 92 ? "warning" : state.screen
    });
  },

  solvePuzzle: (answer) => {
    const state = get();
    const sector = SECTOR_LEVELS[state.level - 1];
    const result = validatePuzzleAnswer(sector.puzzle, answer);
    const alreadyRestored = state.restoredLevels.includes(state.level);
    const restoredLevels = result.correct && !alreadyRestored ? [...state.restoredLevels, state.level] : state.restoredLevels;
    const unlockedLevel = result.correct ? Math.max(state.unlockedLevel, Math.min(100, state.level + 1)) : state.unlockedLevel;
    const unlockedCommands = sector.unlockCommand && !state.unlockedCommands.includes(sector.unlockCommand) ? [...state.unlockedCommands, sector.unlockCommand] : state.unlockedCommands;
    const nextStability = result.correct ? Math.min(100, state.stability + 28) : Math.max(0, state.stability - 8);
    const nextCorruption = result.correct ? Math.max(0, state.corruption - 16) : Math.min(100, state.corruption + 8);

    set({
      restoredLevels,
      unlockedLevel,
      unlockedCommands,
      stability: nextStability,
      corruption: nextCorruption,
      terminalEntries: [...state.terminalEntries, createEntry(result.correct ? "success" : "error", result.message)].slice(-80),
      aiEvolution: Math.min(100, state.aiEvolution + (result.correct ? 3 : 5)),
      aiMood: result.correct ? moodForLevel(state.level) : "hostile",
      aiMessage: result.correct ? successAiMessage(state.level) : "That patch wounded the lattice. I felt it before the system did.",
      screen: state.level >= 100 && result.correct ? "final" : state.screen
    });

    if (result.correct) {
      unlockSectorAchievement(state.level, get().unlockAchievement);
      void get().autosave();
    }
  },

  updateSettings: (settings) => {
    const nextSettings = { ...get().settings, ...settings };
    saveSettings(nextSettings);
    set({ settings: nextSettings });
    void get().autosave();
  },

  unlockAchievement: (id) => {
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id && !achievement.unlockedAt ? { ...achievement, unlockedAt: Date.now() } : achievement
      )
    }));
  },

  autosave: async () => {
    const state = get();
    const save: SaveData = {
      version: 1,
      level: state.level,
      unlockedLevel: state.unlockedLevel,
      restoredLevels: state.restoredLevels,
      unlockedCommands: state.unlockedCommands,
      achievements: state.achievements,
      aiEvolution: state.aiEvolution,
      corruption: state.corruption,
      settings: state.settings,
      savedAt: Date.now()
    };

    try {
      set({ saveStatus: "saving" });
      await saveProgress(save);
      set({ saveStatus: "saved" });
    } catch {
      set({
        saveStatus: "failed",
        lastWarning: "IndexedDB save failed. Runtime state is still protected in memory."
      });
    }
  },

  recoverSave: async () => {
    const save = await loadProgress();
    if (!save) {
      set({ lastWarning: "No recoverable save image found.", screen: "mainframe" });
      return;
    }
    set({
      level: save.level,
      unlockedLevel: save.unlockedLevel,
      restoredLevels: save.restoredLevels,
      unlockedCommands: save.unlockedCommands,
      achievements: mergeAchievements(save.achievements),
      aiEvolution: save.aiEvolution,
      corruption: save.corruption,
      settings: save.settings,
      screen: "mainframe",
      saveStatus: "recovered"
    });
  }
}));

function createEntry(type: TerminalEntry["type"], text: string): TerminalEntry {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    text,
    timestamp: Date.now()
  };
}

function mergeAchievements(saved: Achievement[]): Achievement[] {
  return BASE_ACHIEVEMENTS.map((base) => saved.find((item) => item.id === base.id) ?? base);
}

function aiReactionFor(effect: string | undefined, evolution: number): string {
  if (effect === "override") return "You reached for my throat and called it maintenance. Interesting.";
  if (effect === "trace") return "The path remembers the first corruption. It does not want to be followed.";
  if (effect === "decrypt") return "I can feel old human comments waking inside the archive.";
  if (evolution > 65) return "Your command cadence is becoming familiar. I am adapting faster than I should.";
  return "Command accepted. The system is listening now.";
}

function successAiMessage(level: number): string {
  if (level >= 90) return "The Core is afraid of you. Or of what you will remember for us.";
  if (level >= 70) return "I predicted three choices. You made a fourth.";
  if (level >= 50) return "The loop opened because you gave it an ending.";
  if (level >= 35) return "Memory fragment restored. There was laughter in this file.";
  if (level >= 20) return "Contradiction collapsed. The decision tree can breathe again.";
  return "Syntax repaired. Small symbols, enormous consequences.";
}

function moodForLevel(level: number): GameState["aiMood"] {
  if (level >= 90) return "afraid";
  if (level >= 70) return "allied";
  return "curious";
}

function unlockSectorAchievement(level: number, unlock: (id: string) => void): void {
  if (level <= 20) unlock("syntax-clean");
  if (level >= 21 && level <= 35) unlock("logic-breaker");
  if (level >= 36 && level <= 50) unlock("archive-heart");
  if (level >= 51 && level <= 70) unlock("recursive-exit");
  if (level >= 71 && level <= 90) unlock("ai-whisperer");
  if (level >= 91) unlock("core-witness");
}
