"use client";

import { Cpu, DatabaseZap, ShieldAlert, Signal } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { getBandForLevel } from "@/data/sectors";

export function HUD() {
  const level = useGameStore((state) => state.level);
  const stability = useGameStore((state) => state.stability);
  const corruption = useGameStore((state) => state.corruption);
  const saveStatus = useGameStore((state) => state.saveStatus);
  const band = getBandForLevel(level);

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-20 p-4">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        <HudChip icon={<Cpu className="h-4 w-4" />} label="Node" value={`${String(level).padStart(3, "0")} / 100`} />
        <HudChip icon={<Signal className="h-4 w-4" />} label="Sector" value={band.id.toUpperCase()} accent={band.accent} />
        <HudChip icon={<DatabaseZap className="h-4 w-4" />} label="Stability" value={`${stability}%`} accent="#5cff9d" />
        <HudChip icon={<ShieldAlert className="h-4 w-4" />} label="Save" value={saveStatus.toUpperCase()} accent={corruption > 75 ? "#ff3158" : "#00f6ff"} />
      </div>
    </header>
  );
}

function HudChip({ icon, label, value, accent = "#00f6ff" }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <div className="holo-panel rounded-md px-3 py-2" style={{ borderColor: `${accent}55` }}>
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-100/60">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
