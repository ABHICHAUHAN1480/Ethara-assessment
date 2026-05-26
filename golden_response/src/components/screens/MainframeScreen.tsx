"use client";

import { Activity, Braces, ChevronRight, Settings, Shield, Trophy } from "lucide-react";
import { SECTOR_BANDS, SECTOR_LEVELS } from "@/data/sectors";
import { useGameStore } from "@/stores/gameStore";
import { ActionButton } from "@/components/ui/ActionButton";
import { AIDialogue } from "@/components/ui/AIDialogue";
import { HoloPanel } from "@/components/ui/HoloPanel";
import { HUD } from "@/components/ui/HUD";

export function MainframeScreen() {
  const enterSector = useGameStore((state) => state.enterSector);
  const setScreen = useGameStore((state) => state.setScreen);
  const unlockedLevel = useGameStore((state) => state.unlockedLevel);
  const restoredLevels = useGameStore((state) => state.restoredLevels);
  const corruption = useGameStore((state) => state.corruption);
  const restoredPercentage = Math.round((restoredLevels.length / SECTOR_LEVELS.length) * 100);

  return (
    <div className="h-full overflow-y-auto p-4 pt-24 terminal-scroll md:p-8 md:pt-28">
      <HUD />
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-5">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-cyan/75">AI Mainframe</p>
            <h1 className="mt-2 text-4xl font-semibold text-white md:text-6xl">Restore digital civilization</h1>
          </div>
          <HoloPanel className="p-5" title="Sector Progression">
            <div className="grid gap-3">
              {SECTOR_BANDS.map((band) => {
                const [start, end] = band.range;
                const unlocked = unlockedLevel >= start;
                const restored = restoredLevels.filter((level) => level >= start && level <= end).length;
                const total = end - start + 1;
                return (
                  <button
                    key={band.id}
                    disabled={!unlocked}
                    onClick={() => enterSector(Math.min(unlockedLevel, start))}
                    className="group grid gap-3 rounded-md border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-cyan/45 hover:bg-cyan/10 disabled:cursor-not-allowed disabled:opacity-40 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ background: band.accent, boxShadow: `0 0 18px ${band.accent}` }} />
                        <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-white">{band.title}</h2>
                      </div>
                      <p className="text-sm leading-6 text-cyan-50/68">{band.mechanic}</p>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-sm">
                      <span style={{ color: band.accent }}>{restored}/{total}</span>
                      <ChevronRight className="h-5 w-5 text-cyan/70 transition group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </HoloPanel>
        </section>
        <aside className="space-y-5">
          <AIDialogue />
          <HoloPanel className="p-5" title="Runtime">
            <div className="grid grid-cols-2 gap-3">
              <Metric icon={<Shield className="h-5 w-5" />} label="Restored" value={`${restoredPercentage}%`} />
              <Metric icon={<Activity className="h-5 w-5" />} label="Corruption" value={`${corruption}%`} danger={corruption > 70} />
              <Metric icon={<Braces className="h-5 w-5" />} label="Unlocked" value={`${unlockedLevel}/100`} />
              <Metric icon={<Trophy className="h-5 w-5" />} label="Recovered" value={`${restoredLevels.length}`} />
            </div>
            <div className="mt-5 grid gap-3">
              <ActionButton onClick={() => enterSector(unlockedLevel)}>Enter Active Sector</ActionButton>
              <ActionButton variant="quiet" onClick={() => setScreen("achievements")}>
                <Trophy className="h-4 w-4" /> Achievements
              </ActionButton>
              <ActionButton variant="quiet" onClick={() => setScreen("settings")}>
                <Settings className="h-4 w-4" /> Settings
              </ActionButton>
            </div>
          </HoloPanel>
        </aside>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, danger = false }: { icon: React.ReactNode; label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className={`mb-2 ${danger ? "text-pulse" : "text-cyan"}`}>{icon}</div>
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/50">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
