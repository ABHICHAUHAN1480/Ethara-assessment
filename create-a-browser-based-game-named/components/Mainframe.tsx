"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Cpu, Medal, Settings, ShieldAlert, Zap } from "lucide-react";
import { bandBriefings } from "@/data/dialogue";
import { audioEngine } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";
import { HolographicButton } from "@/components/HolographicButton";

export function Mainframe() {
  const sectors = useGameStore((state) => state.sectors);
  const enterSector = useGameStore((state) => state.enterSector);
  const openSettings = useGameStore((state) => state.openSettings);
  const achievements = useGameStore((state) => state.achievements);
  const restored = useGameStore((state) => state.restoredSectors.length);
  const currentSectorId = useGameStore((state) => state.currentSectorId);
  const currentSector = sectors.find((sector) => sector.id === currentSectorId) ?? sectors[0];
  const unlockedCount = sectors.filter((sector) => sector.unlocked).length;
  const averageCorruption = Math.round(sectors.reduce((sum, sector) => sum + sector.corruption, 0) / sectors.length);

  const selectSector = (id: number) => {
    audioEngine.pulse("success");
    enterSector(id);
  };

  return (
    <motion.div className="relative min-h-dvh p-4 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid min-h-[calc(100dvh-2rem)] gap-4 lg:grid-cols-[320px_1fr_330px]">
        <aside className="glass holo-border flex flex-col p-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan/55">AI Mainframe</p>
              <h2 className="font-display text-2xl font-black uppercase text-white">Sector Mesh</h2>
            </div>
            <button
              onClick={openSettings}
              className="grid h-11 w-11 place-items-center border border-cyan/30 bg-black/30 text-cyan outline-none transition hover:bg-cyan/10 focus-visible:ring-2 focus-visible:ring-cyan"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <Stat label="Restored" value={`${restored}%`} icon={<Zap size={15} />} />
            <Stat label="Unlocked" value={`${unlockedCount}`} icon={<Cpu size={15} />} />
            <Stat label="Corruption" value={`${averageCorruption}%`} icon={<ShieldAlert size={15} />} danger />
            <Stat label="Achievements" value={`${achievements.filter((item) => item.unlocked).length}`} icon={<Medal size={15} />} />
          </div>

          <div className="mt-5 flex-1 overflow-hidden border border-cyan/15 bg-black/25 p-3">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan/60">AI Activity</p>
            <div className="space-y-2">
              {sectors.slice(0, 10).map((sector) => (
                <div key={sector.id} className="flex items-center justify-between gap-3 font-mono text-xs">
                  <span className={sector.restored ? "text-cyan/45" : "text-cyan"}>{sector.name}</span>
                  <span className={sector.corruption > 70 ? "text-glitchRed" : "text-cyan/55"}>{sector.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="glass holo-border relative min-h-[640px] overflow-hidden p-4">
          <div className="absolute inset-0 terminal-grid opacity-20" />
          <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan/55">Holographic World Map</p>
              <h1 className="font-display text-3xl font-black uppercase text-white">Collapsed AI Layers</h1>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-warningYellow">No Navbar / OS Direct Control</div>
          </div>

          <div className="relative z-10 grid h-[calc(100%-5.5rem)] grid-cols-10 grid-rows-10 gap-1.5">
            {sectors.map((sector) => {
              const isCurrent = sector.id === currentSector.id;
              const hue =
                sector.restored ? "bg-cyan/55 border-cyan" : sector.unlocked ? "bg-glitchRed/25 border-glitchRed/45" : "bg-white/5 border-white/10";
              return (
                <motion.button
                  key={sector.id}
                  disabled={!sector.unlocked}
                  onClick={() => selectSector(sector.id)}
                  className={[
                    "group relative min-h-0 border outline-none transition focus-visible:ring-2 focus-visible:ring-cyan disabled:cursor-not-allowed",
                    hue,
                    isCurrent ? "shadow-hologram ring-1 ring-cyan" : ""
                  ].join(" ")}
                  whileHover={sector.unlocked ? { z: 12, scale: 1.12 } : undefined}
                  title={`${sector.name} - ${sector.corruption}% corruption`}
                >
                  <span className="absolute inset-x-1 top-1 h-1 bg-current opacity-40" />
                  <span className="absolute bottom-1 left-1 font-mono text-[0.58rem] text-white/70">{sector.id}</span>
                  <span className="absolute right-1 top-1 font-mono text-[0.52rem] text-white/45">{sector.corruption}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <aside className="glass holo-border flex flex-col p-4">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan/55">Selected Layer</p>
          <h2 className="mt-1 font-display text-2xl font-black uppercase text-white">{currentSector.name}</h2>
          <p className="mt-3 font-mono text-sm text-cyan/75">{currentSector.theme}</p>

          <div className="mt-5 space-y-3">
            <Progress label="Corruption" value={currentSector.corruption} danger />
            <Progress label="Stability" value={currentSector.stability} />
            <Progress label="AI Presence" value={currentSector.aiPresence} warning />
          </div>

          <div className="mt-5 border border-cyan/15 bg-black/25 p-3">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-cyan/60">Briefing</p>
            {bandBriefings[currentSector.band].map((line) => (
              <p key={line} className="mb-2 font-mono text-sm text-cyan/75">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-5 border border-cyan/15 bg-black/25 p-3">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-cyan/60">Achievements</p>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={achievement.unlocked ? "text-cyan" : "text-cyan/35"}>
                  <div className="font-mono text-xs uppercase tracking-[0.14em]">{achievement.label}</div>
                  <div className="font-mono text-xs">{achievement.description}</div>
                </div>
              ))}
            </div>
          </div>

          <HolographicButton onClick={() => selectSector(currentSector.id)} className="mt-auto w-full">
            Enter Corrupted Sector
          </HolographicButton>
        </aside>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, icon, danger }: { label: string; value: string; icon: ReactNode; danger?: boolean }) {
  return (
    <div className="border border-cyan/15 bg-black/25 p-3">
      <div className={["mb-1 flex items-center gap-2 text-lg font-bold", danger ? "text-glitchRed" : "text-cyan"].join(" ")}>
        {icon} {value}
      </div>
      <div className="uppercase tracking-[0.18em] text-cyan/45">{label}</div>
    </div>
  );
}

function Progress({ label, value, danger, warning }: { label: string; value: number; danger?: boolean; warning?: boolean }) {
  const color = danger ? "bg-glitchRed" : warning ? "bg-warningYellow" : "bg-cyan";
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs uppercase tracking-[0.18em] text-cyan/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-white/10">
        <motion.div className={`h-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
