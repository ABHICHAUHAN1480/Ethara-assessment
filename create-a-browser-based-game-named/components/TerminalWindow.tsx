"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { audioEngine } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";
import type { TerminalLine } from "@/types/game";

export function TerminalWindow() {
  const [input, setInput] = useState("");
  const lines = useGameStore((state) => state.terminalLines);
  const execute = useGameStore((state) => state.executeTerminalCommand);
  const settings = useGameStore((state) => state.settings);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: settings.reducedMotion ? "auto" : "smooth" });
  }, [lines, settings.reducedMotion]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    audioEngine.pulse("typing");
    execute(input);
    setInput("");
  };

  return (
    <section className="glass holo-border flex min-h-[430px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-cyan/20 p-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-cyan/70">
          <Terminal size={16} /> Debug Terminal
        </div>
        <div className="flex gap-1">
          <span className="h-2 w-2 bg-glitchRed" />
          <span className="h-2 w-2 bg-warningYellow" />
          <span className="h-2 w-2 bg-cyan" />
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto bg-black/40 p-4 font-mono text-sm">
        {lines.map((line) => (
          <TerminalRow key={line.id} line={line} />
        ))}
      </div>

      <form onSubmit={submit} className="flex border-t border-cyan/20 bg-black/55 p-3 font-mono">
        <span className="mr-2 text-cyan/60">&gt;</span>
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            if (event.target.value.length % 3 === 0) audioEngine.pulse("typing");
          }}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-cyan outline-none placeholder:text-cyan/30"
          placeholder="scan | repair | decrypt | trace | override | stabilize | inject"
          aria-label="Terminal command"
        />
        <span className="ml-2 h-5 w-2 animate-cursor bg-cyan" />
      </form>
    </section>
  );
}

function TerminalRow({ line }: { line: TerminalLine }) {
  const tone =
    line.type === "warning"
      ? "text-glitchRed"
      : line.type === "success"
        ? "text-cyan"
        : line.type === "ai"
          ? "text-warningYellow"
          : line.type === "input"
            ? "text-white"
            : "text-cyan/75";

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={`mb-1 break-words ${tone}`}>
      {line.text}
    </motion.div>
  );
}
