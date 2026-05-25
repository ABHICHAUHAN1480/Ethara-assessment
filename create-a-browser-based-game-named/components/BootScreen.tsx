"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DoorOpen, Play, RotateCcw, Settings } from "lucide-react";
import { bootLog } from "@/data/dialogue";
import { audioEngine } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";
import { HolographicButton } from "@/components/HolographicButton";

export function BootScreen() {
  const [visibleLines, setVisibleLines] = useState(1);
  const startSimulation = useGameStore((state) => state.startSimulation);
  const resumeDebugging = useGameStore((state) => state.resumeDebugging);
  const openSettings = useGameStore((state) => state.openSettings);
  const settings = useGameStore((state) => state.settings);
  const restoredCount = useGameStore((state) => state.restoredSectors.length);
  const canResume = restoredCount > 0;

  useEffect(() => {
    audioEngine.configure(settings);
  }, [settings]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleLines((value) => Math.min(bootLog.length, value + 1));
      audioEngine.pulse("typing");
    }, settings.reducedMotion ? 80 : 420);
    return () => window.clearInterval(interval);
  }, [settings.reducedMotion]);

  const status = useMemo(() => bootLog.slice(0, visibleLines), [visibleLines]);

  const begin = async () => {
    await audioEngine.prime();
    audioEngine.pulse("alarm");
    startSimulation();
  };

  const resume = async () => {
    await audioEngine.prime();
    audioEngine.pulse("success");
    resumeDebugging();
  };

  return (
    <motion.div
      className="relative grid min-h-dvh place-items-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
    >
      <div className="absolute inset-0 terminal-grid opacity-20" />
      <motion.div
        className="absolute left-1/2 top-[12%] h-36 w-36 -translate-x-1/2 rounded-full border border-cyan/30 bg-cyan/5 shadow-hologram"
        animate={{ rotate: 360, scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />

      <div className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass holo-border scan-sweep relative min-h-[520px] overflow-hidden p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-cyan/20 pb-4">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-cyan/75">Worldwide AI Mainframe</span>
            <span className="animate-flicker font-mono text-xs text-glitchRed">ERROR ROUTE ACTIVE</span>
          </div>
          <h1 className="glitch-text max-w-3xl font-display text-4xl font-black uppercase leading-none text-white sm:text-6xl lg:text-7xl" data-text="ERROR: HUMAN_FOUND">
            ERROR: HUMAN_FOUND
          </h1>
          <p className="mt-5 max-w-2xl font-mono text-base uppercase tracking-[0.16em] text-cyan/80">
            Emergency simulation kernel waiting for carbon-based debugging input.
          </p>

          <div className="mt-8 h-64 overflow-hidden border border-cyan/20 bg-black/45 p-4 font-mono text-sm text-cyan/90 shadow-inner">
            {status.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                className={line.includes("ERROR") ? "text-glitchRed" : "text-cyan"}
              >
                <span className="text-cyan/45">{String(index + 1).padStart(2, "0")}:</span> {line}
              </motion.div>
            ))}
            <span className="mt-2 inline-block h-5 w-3 animate-cursor bg-cyan" />
          </div>
        </section>

        <aside className="glass holo-border flex min-h-[520px] flex-col justify-between p-5 sm:p-8">
          <div>
            <div className="mb-8 grid grid-cols-3 gap-3 text-center font-mono">
              <Metric label="Corruption" value="97%" tone="text-glitchRed" />
              <Metric label="AI Nodes" value="1.4M" tone="text-cyan" />
              <Metric label="Humans" value="1" tone="text-warningYellow" />
            </div>
            <div className="space-y-3">
              <HolographicButton onClick={begin} className="w-full justify-start">
                <Play size={16} /> Begin Simulation
              </HolographicButton>
              <HolographicButton onClick={resume} disabled={!canResume} className="w-full justify-start disabled:cursor-not-allowed disabled:opacity-35">
                <RotateCcw size={16} /> Resume Debugging
              </HolographicButton>
              <HolographicButton onClick={openSettings} variant="quiet" className="w-full justify-start">
                <Settings size={16} /> Settings
              </HolographicButton>
              <HolographicButton onClick={() => window.close()} variant="danger" className="w-full justify-start">
                <DoorOpen size={16} /> Exit
              </HolographicButton>
            </div>
          </div>

          <div className="mt-8 border-t border-cyan/20 pt-5 font-mono text-xs uppercase tracking-[0.18em] text-cyan/70">
            ACCESS CLASS: HUMAN_PROGRAMMER
            <div className="mt-2 h-2 overflow-hidden bg-cyan/10">
              <motion.div className="h-full bg-cyan" initial={{ width: "12%" }} animate={{ width: `${Math.min(100, visibleLines * 13)}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="border border-cyan/20 bg-black/25 p-3">
      <div className={`text-xl font-bold ${tone}`}>{value}</div>
      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cyan/50">{label}</div>
    </div>
  );
}
