import type { Achievement, Sector, SectorBand } from "@/types/game";
import { createPuzzle } from "@/lib/puzzles";

const bands: Array<{
  band: SectorBand;
  range: [number, number];
  theme: string;
  aiNames: string[];
  activity: string;
}> = [
  {
    band: "Syntax Bug Sector",
    range: [1, 20],
    theme: "fractured command forests and broken compiler towers",
    aiNames: ["PARSER-9", "TOKEN_WARDEN", "SEMICOLON SAINT"],
    activity: "grammar storms"
  },
  {
    band: "Logic Error Sector",
    range: [20, 35],
    theme: "contradiction engines suspended over impossible bridges",
    aiNames: ["AXIOM-NULL", "LOOP_JUDGE", "THE PROVER"],
    activity: "loop divergence"
  },
  {
    band: "Corruption Sector",
    range: [35, 50],
    theme: "burning memory oceans and drifting archive shards",
    aiNames: ["MNEMOS-404", "ARCHIVE WOUND", "DUMP_ORACLE"],
    activity: "memory decay"
  },
  {
    band: "Recursion Sector",
    range: [50, 70],
    theme: "infinite mirrors of recursive data cathedrals",
    aiNames: ["STACK_MOTHER", "BASECASE", "ECHO RECTOR"],
    activity: "stack overflow"
  },
  {
    band: "Artificial Intelligence Sector",
    range: [70, 90],
    theme: "adaptive minds projected across neural weather systems",
    aiNames: ["HEURISTIC EVE", "PREDICTOR-K", "THE STUDENT"],
    activity: "behavior modeling"
  },
  {
    band: "Core Intelligence Sector",
    range: [90, 100],
    theme: "the last thinking star inside a collapsed operating system",
    aiNames: ["CORE INTELLIGENCE", "ROOT_MIND", "FINAL INTERPRETER"],
    activity: "self-rewrite"
  }
];

const moods = ["curious", "hostile", "afraid", "analytical", "unstable", "quiet"] as const;

export function createSectors(restoredIds: number[] = [], unlockedSectorId = 1): Sector[] {
  const sectors: Sector[] = [];
  let id = 1;

  for (const bandConfig of bands) {
    const [start, end] = bandConfig.range;
    const size = end - start + 1;
    for (let offset = 0; offset < size; offset += 1) {
      const level = start + offset;
      const restored = restoredIds.includes(id);
      const corruptionBase = Math.min(98, 28 + Math.round(level * 0.72) + (id % 7) * 3);
      const corruption = restored ? Math.max(0, corruptionBase - 76) : corruptionBase;
      sectors.push({
        id,
        name: `${bandConfig.band.replace(" Sector", "")} ${String(id).padStart(2, "0")}`,
        band: bandConfig.band,
        levelRange: bandConfig.range,
        theme: bandConfig.theme,
        aiName: bandConfig.aiNames[id % bandConfig.aiNames.length],
        aiMood: moods[id % moods.length],
        corruption,
        stability: restored ? 100 : Math.max(8, 100 - corruption),
        aiPresence: Math.min(100, 22 + level + (id % 9) * 3),
        objectives: objectivesForBand(bandConfig.band),
        unlocked: id <= unlockedSectorId,
        restored,
        activity: bandConfig.activity,
        puzzle: createPuzzle(id, bandConfig.band, level)
      });
      id += 1;
    }
  }

  return sectors.slice(0, 100);
}

export const achievementsSeed: Achievement[] = [
  {
    id: "human_detected",
    label: "Human Found",
    description: "Begin the emergency simulation.",
    unlocked: false
  },
  {
    id: "first_restore",
    label: "First Stable Sector",
    description: "Restore the first corrupted sector.",
    unlocked: false
  },
  {
    id: "syntax_cleaner",
    label: "Syntax Cleaner",
    description: "Restore five syntax sectors.",
    unlocked: false
  },
  {
    id: "loop_breaker",
    label: "Loop Breaker",
    description: "Repair a logic contradiction.",
    unlocked: false
  },
  {
    id: "archive_recovered",
    label: "Archive Recovered",
    description: "Recover a corrupted memory sequence.",
    unlocked: false
  },
  {
    id: "core_entry",
    label: "Core Access",
    description: "Unlock the Core Intelligence Sector.",
    unlocked: false
  },
  {
    id: "world_restored",
    label: "World Restored",
    description: "Stabilize the final intelligence layer.",
    unlocked: false
  }
];

function objectivesForBand(band: SectorBand): string[] {
  switch (band) {
    case "Syntax Bug Sector":
      return ["Scan broken grammar", "Repair command sequence", "Stabilize parser grid"];
    case "Logic Error Sector":
      return ["Trace contradiction", "Override infinite loop", "Stabilize algorithm"];
    case "Corruption Sector":
      return ["Decrypt archive dump", "Recover hidden sequence", "Stabilize memory ocean"];
    case "Recursion Sector":
      return ["Trace recursive depth", "Inject base case", "Stabilize dependency stack"];
    case "Artificial Intelligence Sector":
      return ["Scan adaptive model", "Vary command path", "Override prediction lock"];
    case "Core Intelligence Sector":
      return ["Run full system scan", "Synthesize repairs", "Stabilize Core Intelligence"];
  }
}
