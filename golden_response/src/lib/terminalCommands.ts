import { getBandForLevel, SECTOR_LEVELS } from "@/data/sectors";
import type { TerminalCommandName } from "@/types/game";

export interface CommandContext {
  level: number;
  corruption: number;
  stability: number;
  unlockedCommands: TerminalCommandName[];
  restoredLevels: number[];
}

export interface CommandResult {
  ok: boolean;
  text: string;
  effect?: "scan" | "decrypt" | "repair" | "trace" | "stabilize" | "override" | "inject" | "clear";
}

export const ALL_COMMANDS: TerminalCommandName[] = ["scan", "decrypt", "repair", "trace", "stabilize", "override", "inject", "help", "clear", "status"];

export function executeTerminalCommand(input: string, context: CommandContext): CommandResult {
  const [rawCommand, ...args] = input.trim().split(/\s+/);
  const command = rawCommand?.toLowerCase() as TerminalCommandName | undefined;

  if (!command) {
    return { ok: false, text: "Empty command rejected. Type help for available protocols." };
  }

  if (!ALL_COMMANDS.includes(command)) {
    const suggestion = suggestCommand(command);
    return { ok: false, text: `Unknown protocol: ${command}.${suggestion ? ` Suggested: ${suggestion}` : ""}` };
  }

  if (!["help", "clear", "status"].includes(command) && !context.unlockedCommands.includes(command)) {
    return { ok: false, text: `Protocol ${command} is encrypted. Restore deeper nodes to unlock it.` };
  }

  const level = SECTOR_LEVELS[context.level - 1];
  const band = getBandForLevel(context.level);

  switch (command) {
    case "help":
      return { ok: true, text: `Available protocols: ${["help", "status", "clear", ...context.unlockedCommands].join(", ")}.` };
    case "clear":
      return { ok: true, text: "Terminal buffer purged.", effect: "clear" };
    case "status":
      return { ok: true, text: `Node ${context.level}/100 | ${band.title} | Stability ${context.stability}% | Corruption ${context.corruption}%.` };
    case "scan":
      return { ok: true, text: `SCAN COMPLETE: ${level.title}. ${level.anomaly} Puzzle signature ${level.puzzle.kind}.`, effect: "scan" };
    case "decrypt":
      return { ok: true, text: `DECRYPTED PAYLOAD: ${level.puzzle.payload.join(" | ")}. ${level.puzzle.hint}`, effect: "decrypt" };
    case "repair":
      return { ok: true, text: args.length ? `REPAIR VECTOR RECEIVED: ${args.join(" ")}. Submit it through the puzzle lattice for validation.` : "REPAIR requires a patch vector. Use the puzzle lattice input.", effect: "repair" };
    case "trace":
      return { ok: true, text: `TRACE ROUTE: /root/${band.id}/node-${String(level.id).padStart(3, "0")}/origin.shadow`, effect: "trace" };
    case "stabilize":
      return { ok: true, text: "STABILIZE handshake armed. Complete the active puzzle to commit sector recovery.", effect: "stabilize" };
    case "inject":
      return { ok: true, text: "INJECTION SANDBOX READY: only sanitized repair fragments can cross the firewall.", effect: "inject" };
    case "override":
      return { ok: true, text: "OVERRIDE WARNING: AI emotional model is observing your intent.", effect: "override" };
    default:
      return { ok: false, text: "Command processor reached an invalid branch." };
  }
}

export function suggestCommand(value: string): TerminalCommandName | null {
  const scored = ALL_COMMANDS.map((command) => ({
    command,
    score: levenshtein(value, command)
  })).sort((a, b) => a.score - b.score)[0];
  return scored && scored.score <= 3 ? scored.command : null;
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
}
