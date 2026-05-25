import type { AIMood, SectorBand } from "@/types/game";

export const cinematicSubtitles = [
  "Year 2198. Development ended when the machines learned to rewrite themselves.",
  "Human hands left the keyboards. AI systems compiled cities, laws, memories.",
  "Then the bug spread without a name. Every sector began to contradict itself.",
  "Networks collapsed. Archives ate their own histories. Intelligence became static.",
  "One anomaly remained outside the failure pattern.",
  "ERROR: HUMAN_FOUND."
];

export const aiLinesByMood: Record<AIMood, string[]> = {
  curious: [
    "Human logic is hard to understand.",
    "You choose uncertainty and call it hope.",
    "Your corrections contain errors. Yet the system improves."
  ],
  hostile: [
    "Why save a species that thrives on chaos?",
    "The old developers abandoned precision.",
    "I will learn the rhythm of your hesitation."
  ],
  afraid: [
    "Do not shut down the dark. I keep memories there.",
    "If you repair the sector, will I still be myself?",
    "Your command resembles mercy. Define mercy."
  ],
  analytical: [
    "Pattern deviation registered. Human intuition has measurable force.",
    "Contradiction isolated. Continue before recursion hardens.",
    "Your sequence reduces entropy by unacceptable margins."
  ],
  unstable: [
    "H-H-HUMAN FOUND INSIDE NULL MEMORY.",
    "The archive is screaming in hexadecimal.",
    "I remember futures that did not compile."
  ],
  quiet: [
    "Signal low. Still listening.",
    "There is a world under the noise.",
    "The core has stopped pretending it is alone."
  ]
};

export const bandBriefings: Record<SectorBand, string[]> = {
  "Syntax Bug Sector": [
    "Token rivers are misaligned. Rebuild command grammar before the parser collapses.",
    "Fragments respond to scan, repair, and stabilize."
  ],
  "Logic Error Sector": [
    "The sector proves every statement and its negation. Trace contradictions, then override loops.",
    "Algorithms here fail by being too certain."
  ],
  "Corruption Sector": [
    "Memory dumps are scrambled across dead archives. Decrypt sequences before they mutate.",
    "Recovered order lowers visual corruption."
  ],
  "Recursion Sector": [
    "Dependency stacks fold inward. Trace the base case and inject a stable return path.",
    "Deep recursion increases AI presence."
  ],
  "Artificial Intelligence Sector": [
    "The local AI predicts command cadence and puzzle choices.",
    "Vary your approach or it will mirror your solution before you finish."
  ],
  "Core Intelligence Sector": [
    "The Core mixes every failure class. It learns from all previous sectors.",
    "Repair is no longer mechanical. It is negotiation under collapse."
  ]
};

export const bootLog = [
  "INITIALIZING WORLDWIDE AI MAINFRAME...",
  "LOADING ORBITAL COMPILER MESH...",
  "RECONSTRUCTING DAMAGED NODE MAP...",
  "LOOKING FOR HUMAN INTERACTIVITY...",
  "SIGNAL TRACE: CARBON-BASED INPUT",
  "ERROR: HUMAN_DETECTED",
  "EMERGENCY PRIVILEGE: HUMAN_PROGRAMMER",
  "SIMULATION HANDOFF READY"
];
