import type { Sector, TerminalCommand } from "@/types/game";

export function runCommand(command: TerminalCommand, sector: Sector, prefixMatches: number) {
  const lines: string[] = [];
  let corruptionDelta = 0;
  let stabilityDelta = 0;

  switch (command) {
    case "scan":
      lines.push(`SCAN ${sector.name}: corruption ${sector.corruption}% | AI presence ${sector.aiPresence}%`);
      lines.push(`THEME: ${sector.theme}`);
      stabilityDelta = 2;
      break;
    case "repair":
      lines.push("REPAIR PATCH SENT TO FRACTURED LOGIC BUS");
      corruptionDelta = prefixMatches > 0 ? -10 : -4;
      stabilityDelta = prefixMatches > 0 ? 12 : 5;
      break;
    case "decrypt":
      lines.push("DECRYPTION LAYER OPENED: hidden archive fragments exposed");
      corruptionDelta = -7;
      stabilityDelta = 8;
      break;
    case "trace":
      lines.push("TRACE COMPLETE: recursive fault line mapped");
      corruptionDelta = -5;
      stabilityDelta = 7;
      break;
    case "override":
      lines.push("OVERRIDE ACCEPTED: contradiction priority lowered");
      corruptionDelta = -9;
      stabilityDelta = 10;
      break;
    case "stabilize":
      lines.push("STABILITY WAVE DEPLOYED ACROSS HOLOGRAPHIC GRID");
      corruptionDelta = -12;
      stabilityDelta = 14;
      break;
    case "inject":
      lines.push("INJECTED HUMAN HEURISTIC INTO ADAPTIVE MODEL");
      corruptionDelta = -8;
      stabilityDelta = 9;
      break;
  }

  return { lines, corruptionDelta, stabilityDelta };
}

export function helpLines() {
  return [
    "COMMANDS: scan | repair | decrypt | trace | override | stabilize | inject",
    "Use commands in the puzzle sequence shown by the sector analysis."
  ];
}
