"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Terminal, Zap } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ALL_COMMANDS } from "@/lib/terminalCommands";
import { useGameStore } from "@/stores/gameStore";
import { HoloPanel } from "@/components/ui/HoloPanel";

export function TerminalInterface() {
  const entries = useGameStore((state) => state.terminalEntries);
  const executeCommand = useGameStore((state) => state.executeCommand);
  const history = useGameStore((state) => state.commandHistory);
  const unlockedCommands = useGameStore((state) => state.unlockedCommands);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commands = useMemo(() => ["help", "status", "clear", ...unlockedCommands], [unlockedCommands]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    executeCommand(input);
    setInput("");
    setHistoryIndex(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const match = ALL_COMMANDS.find((command) => command.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = Math.min(history.length - 1, historyIndex + 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? input);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = Math.max(-1, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex === -1 ? "" : history[nextIndex] ?? "");
    }
  };

  return (
    <HoloPanel className="flex min-h-[360px] flex-col" title="Holographic Terminal">
      <div ref={scrollRef} className="terminal-scroll h-72 flex-1 overflow-y-auto p-4 font-mono text-sm leading-6">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: entry.type === "input" ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              className={entryClass(entry.type)}
            >
              {entry.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={submit} className="border-t border-cyan/15 p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {commands.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => setInput(command)}
              className="rounded border border-cyan/20 bg-cyan/5 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-100/70 transition hover:bg-cyan/15"
            >
              {command}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-md border border-cyan/20 bg-black/40 px-3 py-2">
          <Terminal className="h-4 w-4 text-cyan" />
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-cyan-50 outline-none placeholder:text-cyan-100/35"
            placeholder="scan | decrypt | repair | trace | stabilize"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="h-5 w-2 animate-pulse bg-cyan" />
          <button type="submit" className="rounded border border-cyan/30 p-2 text-cyan transition hover:bg-cyan/10" aria-label="execute terminal command">
            <Zap className="h-4 w-4" />
          </button>
        </label>
      </form>
    </HoloPanel>
  );
}

function entryClass(type: string): string {
  const base = "mb-2 whitespace-pre-wrap break-words";
  const styles: Record<string, string> = {
    input: "text-cyan",
    system: "text-cyan-50/78",
    ai: "text-violet-200",
    error: "text-pulse",
    success: "text-matrix"
  };
  return `${base} ${styles[type] ?? styles.system}`;
}
