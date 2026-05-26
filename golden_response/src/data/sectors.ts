import type { PuzzleDefinition, PuzzleKind, SectorBand, SectorLevel, TerminalCommandName } from "@/types/game";

export const SECTOR_BANDS: SectorBand[] = [
  {
    id: "syntax",
    title: "SYNTAX BUG SECTOR",
    range: [1, 20],
    theme: "Broken code environments and fragmented terminal structures.",
    mechanic: "Repair malformed commands, missing tokens, and terminal parsers.",
    visual: "Neon green terminals, fragmented text, scanline glitches, corrupted code particles.",
    accent: "#5cff9d",
    secondary: "#00f6ff",
    puzzleKinds: ["syntax-repair"]
  },
  {
    id: "logic",
    title: "LOGIC ERROR SECTOR",
    range: [21, 35],
    theme: "Contradictory AI systems and collapsing decision trees.",
    mechanic: "Fix contradictions, sequence decisions, and break unstable loops.",
    visual: "Recursive loops, shifting holograms, flickering pathways.",
    accent: "#00f6ff",
    secondary: "#f8d84a",
    puzzleKinds: ["logic-sequence"]
  },
  {
    id: "corruption",
    title: "CORRUPTION SECTOR",
    range: [36, 50],
    theme: "Destroyed memory archives and unstable data fragments.",
    mechanic: "Restore archives, trace fragments, and cleanse memory decay.",
    visual: "Distorted environments, floating fragments, red glitch overlays.",
    accent: "#ff3158",
    secondary: "#9a4dff",
    puzzleKinds: ["memory-restore"]
  },
  {
    id: "recursion",
    title: "RECURSION SECTOR",
    range: [51, 70],
    theme: "Infinite pathways, duplicated systems, and repeating environments.",
    mechanic: "Debug recursive dependencies and escape looping structures.",
    visual: "Infinite mirrors, looping corridors, duplicated holograms.",
    accent: "#9a4dff",
    secondary: "#00f6ff",
    puzzleKinds: ["recursion-trace"]
  },
  {
    id: "intelligence",
    title: "ARTIFICIAL INTELLIGENCE SECTOR",
    range: [71, 90],
    theme: "Self-learning digital consciousness and adaptive interfaces.",
    mechanic: "Predict evolving AI behavior while interface rules mutate.",
    visual: "Living interfaces, responsive environments, shifting UI systems.",
    accent: "#ff7ad9",
    secondary: "#5cff9d",
    puzzleKinds: ["ai-predict"]
  },
  {
    id: "core",
    title: "CORE INTELLIGENCE SECTOR",
    range: [91, 100],
    theme: "Central AI consciousness and a collapsing digital universe.",
    mechanic: "Combine every repair discipline for the final restoration chain.",
    visual: "Massive holographic structures, unstable realities, collapsing digital worlds.",
    accent: "#ffffff",
    secondary: "#ff3158",
    puzzleKinds: ["core-synthesis"]
  }
];

const commandUnlocks: Record<number, TerminalCommandName> = {
  1: "scan",
  3: "repair",
  8: "decrypt",
  15: "trace",
  24: "stabilize",
  43: "inject",
  72: "override"
};

const syntaxPayloads = [
  { payload: ["if (sector.status === 'broken' {", "  repair(sector)", "}"], answer: "if (sector.status === 'broken') {" },
  { payload: ["const key == decrypt(packet);", "return key;"], answer: "const key = decrypt(packet);" },
  { payload: ["repair[terminal.core);", "await sync();"], answer: "repair(terminal.core);" },
  { payload: ["while signal < target)", "  signal++"], answer: "while (signal < target) {" }
];

const logicPayloads = [
  { payload: ["A before C", "B after A", "C after B"], answer: "ABC" },
  { payload: ["0, 1, 1, 2, 3, ?"], answer: "5" },
  { payload: ["TRUE locks gate", "FALSE opens gate", "gate is locked"], answer: "TRUE" },
  { payload: ["north=2", "east=4", "south=8", "west=?"], answer: "16" }
];

const memoryPayloads = [
  { payload: ["M3M", "0RY", "A7C"], answer: "MEMORY" },
  { payload: ["archive: hum_n", "missing vowel sequence"], answer: "human" },
  { payload: ["checksum 14", "fragments 2 5 7"], answer: "257" },
  { payload: ["lost label", "D_TA"], answer: "DATA" }
];

const recursionPayloads = [
  { payload: ["f(1)=1", "f(n)=n*f(n-1)", "f(4)=?"], answer: "24" },
  { payload: ["loop: A -> B -> C -> A", "break node"], answer: "C" },
  { payload: ["mirror depths: 1, 2, 4, 8, ?"], answer: "16" },
  { payload: ["dependency core imports shell imports ui imports core", "remove"], answer: "ui" }
];

const aiPayloads = [
  { payload: ["AI chooses opposite of last human input", "last input: left"], answer: "right" },
  { payload: ["trust rises with repair", "fear rises with override", "calm action?"], answer: "repair" },
  { payload: ["model predicts 3, 6, 12, ?"], answer: "24" },
  { payload: ["AI masks command: t?ace"], answer: "trace" }
];

const corePayloads = [
  { payload: ["syntax + logic + memory", "final verb"], answer: "stabilize" },
  { payload: ["human key", "machine lock", "shared protocol"], answer: "override" },
  { payload: ["collapse at 99", "target stability"], answer: "100" },
  { payload: ["origin signature", "not machine, not virus"], answer: "human" }
];

function bandForLevel(level: number): SectorBand {
  const band = SECTOR_BANDS.find((item) => level >= item.range[0] && level <= item.range[1]);
  return band ?? SECTOR_BANDS[0];
}

function puzzleFor(level: number, kind: PuzzleKind): PuzzleDefinition {
  const index = level % 4;
  const map = {
    "syntax-repair": syntaxPayloads[index],
    "logic-sequence": logicPayloads[index],
    "memory-restore": memoryPayloads[index],
    "recursion-trace": recursionPayloads[index],
    "ai-predict": aiPayloads[index],
    "core-synthesis": corePayloads[index]
  } satisfies Record<PuzzleKind, { payload: string[]; answer: string }>;

  const copy = map[kind];
  const prompts = {
    "syntax-repair": "Patch the invalid line exactly as the terminal parser expects.",
    "logic-sequence": "Resolve the contradiction or complete the unstable algorithm.",
    "memory-restore": "Recover the missing memory token from the damaged archive.",
    "recursion-trace": "Find the recursion key that breaks the repeating chain.",
    "ai-predict": "Predict the adaptive intelligence before it changes the interface again.",
    "core-synthesis": "Synthesize the final command fragment from prior sector logic."
  } satisfies Record<PuzzleKind, string>;

  return {
    id: `${kind}-${level}`,
    kind,
    prompt: prompts[kind],
    payload: copy.payload,
    answer: copy.answer,
    hint: `Signal entropy suggests ${copy.answer.length} character${copy.answer.length === 1 ? "" : "s"}.`
  };
}

export function buildSectorLevels(): SectorLevel[] {
  return Array.from({ length: 100 }, (_, offset) => {
    const id = offset + 1;
    const band = bandForLevel(id);
    const kind = band.puzzleKinds[0];
    return {
      id,
      bandId: band.id,
      title: `${band.title.split(" ").slice(0, -1).join(" ")} NODE ${String(id).padStart(3, "0")}`,
      anomaly: `${band.theme} Integrity variance ${(id * 17) % 91}%.`,
      corruption: Math.min(99, Math.round(12 + id * 0.82)),
      stabilityTarget: Math.min(100, 45 + Math.round(id * 0.55)),
      unlockCommand: commandUnlocks[id],
      puzzle: puzzleFor(id, kind)
    };
  });
}

export const SECTOR_LEVELS = buildSectorLevels();

export function getBandForLevel(level: number): SectorBand {
  return bandForLevel(level);
}
