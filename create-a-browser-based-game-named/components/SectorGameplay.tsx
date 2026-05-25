"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, GitBranch, ShieldCheck } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { HUD } from "@/components/HUD";
import { TerminalWindow } from "@/components/TerminalWindow";
import { AIComms } from "@/components/AIComms";
import { ProgressPanel } from "@/components/ProgressPanel";

export function SectorGameplay() {
  const sectors = useGameStore((state) => state.sectors);
  const currentSectorId = useGameStore((state) => state.currentSectorId);
  const setScreen = useGameStore((state) => state.setScreen);
  const achievements = useGameStore((state) => state.achievements);
  const restoredCount = useGameStore((state) => state.restoredSectors.length);
  const commandHistory = useGameStore((state) => state.commandHistory);
  const sector = sectors.find((item) => item.id === currentSectorId) ?? sectors[0];
  const pulse = commandHistory.length + sector.puzzle.attempts;

  const instability = useMemo(() => {
    return {
      filter: `hue-rotate(${sector.corruption * 0.7}deg) saturate(${1 + sector.corruption / 130})`,
      transform: `translate(${sector.corruption > 75 ? (pulse % 2 === 0 ? 1 : -1) : 0}px, 0)`
    };
  }, [pulse, sector.corruption]);

  return (
    <motion.div className="relative min-h-dvh overflow-hidden p-4 pt-36 sm:p-6 sm:pt-32" style={instability} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HUD sector={sector} />
      <div className="absolute inset-0 terminal-grid opacity-10" />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background: `radial-gradient(circle at ${35 + sector.corruption / 4}% ${30 + (pulse % 8)}%, rgba(255,45,85,${sector.corruption / 320}), transparent 30%)`
        }}
      />

      <button
        onClick={() => setScreen("mainframe")}
        className="fixed left-4 top-[8.5rem] z-40 inline-flex h-11 w-11 items-center justify-center border border-cyan/30 bg-black/50 text-cyan outline-none transition hover:bg-cyan/10 focus-visible:ring-2 focus-visible:ring-cyan sm:top-24"
        aria-label="Return to mainframe"
        title="Return to mainframe"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="relative z-10 grid min-h-[calc(100dvh-10rem)] gap-4 xl:grid-cols-[1fr_380px]">
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass holo-border relative min-h-[520px] overflow-hidden p-4">
            <div className="absolute inset-0 scanlines opacity-20" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan/55">{sector.band}</p>
              <h1 className="mt-1 font-display text-4xl font-black uppercase leading-none text-white">{sector.name}</h1>
              <p className="mt-4 font-mono text-sm text-cyan/75">{sector.theme}</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Node icon={<Cpu size={18} />} label="AI" value={`${sector.aiPresence}%`} />
                <Node icon={<GitBranch size={18} />} label="Puzzle" value={sector.puzzle.kind.replaceAll("_", " ")} />
                <Node icon={<ShieldCheck size={18} />} label="State" value={sector.restored ? "restored" : "unstable"} />
              </div>
              <div className="mt-6 border border-cyan/15 bg-black/35 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan/55">Analysis</p>
                <h2 className="mt-2 font-display text-xl font-bold uppercase text-white">{sector.puzzle.title}</h2>
                <p className="mt-2 font-mono text-sm text-cyan/75">{sector.puzzle.prompt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sector.puzzle.fragments.map((fragment, index) => (
                    <motion.span
                      key={`${fragment}-${index}`}
                      className="border border-cyan/25 bg-cyan/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan"
                      animate={{ y: [0, -3, 0], opacity: [0.72, 1, 0.72] }}
                      transition={{ repeat: Infinity, duration: 2.4 + index * 0.2 }}
                    >
                      {fragment}
                    </motion.span>
                  ))}
                </div>
                <div className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-warningYellow">
                  Required sequence: {sector.puzzle.solution.join(" -> ")}
                </div>
              </div>
            </div>
          </div>

          <TerminalWindow />
        </section>

        <aside className="grid content-start gap-4">
          <AIComms sector={sector} pulse={pulse} />
          <ProgressPanel sector={sector} achievements={achievements} restoredCount={restoredCount} />
        </aside>
      </div>
    </motion.div>
  );
}

function Node({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-h-24 border border-cyan/15 bg-black/25 p-3">
      <div className="mb-2 text-cyan">{icon}</div>
      <div className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan/45">{label}</div>
      <div className="mt-1 break-words font-mono text-xs uppercase text-white/85">{value}</div>
    </div>
  );
}
