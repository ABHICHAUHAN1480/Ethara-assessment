"use client";

import { create } from "zustand";
import { achievementsSeed, createSectors } from "@/data/sectors";
import { aiLinesByMood } from "@/data/dialogue";
import { evaluateCommandProgress, isTerminalCommand } from "@/lib/puzzles";
import { helpLines, runCommand } from "@/lib/terminal";
import type { Achievement, GameSettings, SavePayload, Screen, Sector, TerminalLine } from "@/types/game";

type GameState = {
  hydrated: boolean;
  screen: Screen;
  settingsOpen: boolean;
  sectors: Sector[];
  currentSectorId: number;
  unlockedSectorId: number;
  restoredSectors: number[];
  achievements: Achievement[];
  settings: GameSettings;
  terminalLines: TerminalLine[];
  commandHistory: string[];
  storyFlags: Record<string, boolean>;
  lastSavedAt: number;
  corruptionPulse: number;
  setScreen: (screen: Screen) => void;
  startSimulation: () => void;
  resumeDebugging: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (patch: Partial<GameSettings>) => void;
  hydrate: (payload: SavePayload | null) => void;
  enterSector: (id: number) => void;
  executeTerminalCommand: (input: string) => void;
  completeSector: () => void;
  makeSavePayload: () => SavePayload;
  resetRun: () => void;
};

export const defaultSettings: GameSettings = {
  music: true,
  sfx: true,
  subtitles: true,
  reducedMotion: false,
  highContrast: false,
  colorblindMode: false,
  graphics: "balanced",
  uiScale: 1,
  keyboardControls: true
};

const initialSectors = createSectors([], 1);

export const useGameStore = create<GameState>((set, get) => ({
  hydrated: false,
  screen: "boot",
  settingsOpen: false,
  sectors: initialSectors,
  currentSectorId: 1,
  unlockedSectorId: 1,
  restoredSectors: [],
  achievements: achievementsSeed,
  settings: defaultSettings,
  terminalLines: makeInitialLines(initialSectors[0]),
  commandHistory: [],
  storyFlags: {},
  lastSavedAt: Date.now(),
  corruptionPulse: 0,

  setScreen: (screen) => set({ screen }),

  startSimulation: () => {
    const achievements = unlock(get().achievements, "human_detected");
    set({ screen: "intro", achievements, storyFlags: { ...get().storyFlags, introStarted: true } });
  },

  resumeDebugging: () => set({ screen: "mainframe" }),

  openSettings: () => set({ settingsOpen: true }),

  closeSettings: () => set({ settingsOpen: false }),

  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch }, lastSavedAt: Date.now() })),

  hydrate: (payload) => {
    if (!payload) {
      set({ hydrated: true });
      return;
    }

    const sectors = createSectors(payload.restoredSectors, payload.unlockedSectorId);
    const currentSector = sectors.find((sector) => sector.id === payload.currentSectorId) ?? sectors[0];
    set({
      hydrated: true,
      sectors,
      currentSectorId: currentSector.id,
      unlockedSectorId: payload.unlockedSectorId,
      restoredSectors: payload.restoredSectors,
      achievements: mergeAchievements(payload.achievements),
      settings: { ...defaultSettings, ...payload.settings },
      commandHistory: payload.commandHistory,
      storyFlags: payload.storyFlags,
      lastSavedAt: payload.lastSavedAt,
      terminalLines: makeInitialLines(currentSector)
    });
  },

  enterSector: (id) => {
    const sector = get().sectors.find((item) => item.id === id);
    if (!sector || !sector.unlocked) {
      return;
    }
    set({
      currentSectorId: id,
      screen: "sector",
      terminalLines: makeInitialLines(sector),
      commandHistory: [],
      corruptionPulse: sector.corruption
    });
  },

  executeTerminalCommand: (rawInput) => {
    const input = rawInput.trim().toLowerCase();
    const state = get();
    const sector = state.sectors.find((item) => item.id === state.currentSectorId) ?? state.sectors[0];

    if (!input) {
      return;
    }

    if (input === "help") {
      set({ terminalLines: appendLines(state.terminalLines, "input", `> ${input}`).concat(helpLines().map((text) => line("system", text))) });
      return;
    }

    if (!isTerminalCommand(input)) {
      set({
        terminalLines: appendLines(state.terminalLines, "input", `> ${input}`).concat(
          line("warning", `UNKNOWN COMMAND "${input}". Type help for terminal vocabulary.`)
        ),
        corruptionPulse: Math.min(100, state.corruptionPulse + 7)
      });
      return;
    }

    const commandHistory = [...state.commandHistory, input].slice(-24);
    const progress = evaluateCommandProgress(sector.puzzle.solution, commandHistory);
    const result = runCommand(input, sector, progress.matchingPrefix);
    const nextSectors = state.sectors.map((item) => {
      if (item.id !== sector.id) {
        return item;
      }
      return {
        ...item,
        corruption: clamp(item.corruption + result.corruptionDelta, 0, 100),
        stability: clamp(item.stability + result.stabilityDelta, 0, 100),
        puzzle: {
          ...item.puzzle,
          attempts: item.puzzle.attempts + 1,
          solved: item.puzzle.solved || progress.exact
        }
      };
    });

    const updatedSector = nextSectors.find((item) => item.id === sector.id) ?? sector;
    const aiText = aiLinesByMood[updatedSector.aiMood][commandHistory.length % aiLinesByMood[updatedSector.aiMood].length];
    const terminalLines = appendLines(state.terminalLines, "input", `> ${input}`)
      .concat(result.lines.map((text) => line("system", text)))
      .concat(line("ai", `${updatedSector.aiName}: ${progress.exact ? "Sequence accepted. Stability threshold within reach." : aiText}`));

    set({
      sectors: nextSectors,
      commandHistory,
      terminalLines: terminalLines.slice(-42),
      corruptionPulse: updatedSector.corruption,
      lastSavedAt: Date.now()
    });

    const nowSector = get().sectors.find((item) => item.id === sector.id);
    if (nowSector && (progress.exact || nowSector.stability >= 96 || nowSector.corruption <= 3)) {
      get().completeSector();
    }
  },

  completeSector: () => {
    const state = get();
    const sector = state.sectors.find((item) => item.id === state.currentSectorId);
    if (!sector || state.restoredSectors.includes(sector.id)) {
      return;
    }

    const restoredSectors = [...state.restoredSectors, sector.id];
    const unlockedSectorId = Math.min(100, Math.max(state.unlockedSectorId, sector.id + 1));
    let achievements = unlock(state.achievements, "first_restore");
    if (restoredSectors.filter((id) => id <= 20).length >= 5) achievements = unlock(achievements, "syntax_cleaner");
    if (sector.band === "Logic Error Sector") achievements = unlock(achievements, "loop_breaker");
    if (sector.band === "Corruption Sector") achievements = unlock(achievements, "archive_recovered");
    if (unlockedSectorId >= 90) achievements = unlock(achievements, "core_entry");
    if (sector.id === 100) achievements = unlock(achievements, "world_restored");

    const sectors = state.sectors.map((item) => {
      if (item.id === sector.id) {
        return { ...item, restored: true, corruption: 0, stability: 100, puzzle: { ...item.puzzle, solved: true } };
      }
      if (item.id <= unlockedSectorId) {
        return { ...item, unlocked: true };
      }
      return item;
    });

    set({
      sectors,
      restoredSectors,
      unlockedSectorId,
      achievements,
      terminalLines: appendLines(state.terminalLines, "success", `SECTOR ${sector.id} RESTORED. Deeper AI layer unlocked.`),
      lastSavedAt: Date.now()
    });
  },

  makeSavePayload: () => {
    const state = get();
    return {
      version: 1,
      currentSectorId: state.currentSectorId,
      restoredSectors: state.restoredSectors,
      unlockedSectorId: state.unlockedSectorId,
      totalRestored: state.restoredSectors.length,
      achievements: state.achievements,
      settings: state.settings,
      commandHistory: state.commandHistory,
      storyFlags: state.storyFlags,
      lastSavedAt: Date.now()
    };
  },

  resetRun: () => {
    const sectors = createSectors([], 1);
    set({
      screen: "boot",
      sectors,
      currentSectorId: 1,
      unlockedSectorId: 1,
      restoredSectors: [],
      achievements: achievementsSeed,
      terminalLines: makeInitialLines(sectors[0]),
      commandHistory: [],
      storyFlags: {},
      lastSavedAt: Date.now()
    });
  }
}));

function makeInitialLines(sector: Sector): TerminalLine[] {
  return [
    line("system", "HUMAN PROGRAMMER TERMINAL READY"),
    line("system", `ACTIVE SECTOR: ${sector.name}`),
    line("warning", `CORRUPTION: ${sector.corruption}% | REQUIRED: ${sector.puzzle.solution.join(" -> ")}`)
  ];
}

function line(type: TerminalLine["type"], text: string): TerminalLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    text,
    timestamp: Date.now()
  };
}

function appendLines(lines: TerminalLine[], type: TerminalLine["type"], text: string) {
  return [...lines, line(type, text)];
}

function unlock(achievements: Achievement[], id: string) {
  return achievements.map((achievement) =>
    achievement.id === id && !achievement.unlocked
      ? { ...achievement, unlocked: true, timestamp: Date.now() }
      : achievement
  );
}

function mergeAchievements(saved: Achievement[]) {
  return achievementsSeed.map((seed) => saved.find((achievement) => achievement.id === seed.id) ?? seed);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
