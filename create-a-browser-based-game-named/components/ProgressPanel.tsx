"use client";

import { motion } from "framer-motion";
import type { Achievement, Sector } from "@/types/game";

export function ProgressPanel({ sector, achievements, restoredCount }: { sector: Sector; achievements: Achievement[]; restoredCount: number }) {
  const unlockedAbilities = abilityCount(restoredCount);

  return (
    <section className="glass holo-border p-4">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan/55">Restoration Metrics</p>
      <div className="mt-3 space-y-3">
        <Bar label="Sector Completion" value={sector.restored ? 100 : sector.puzzle.solved ? 88 : Math.max(5, sector.stability)} />
        <Bar label="World Restored" value={restoredCount} />
        <Bar label="Puzzle Stats" value={sector.puzzle.solved ? 100 : Math.min(95, sector.puzzle.attempts * 18)} />
        <Bar label="Corruption Stats" value={100 - sector.corruption} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
        <Box label="Abilities" value={unlockedAbilities} />
        <Box label="Achievements" value={achievements.filter((item) => item.unlocked).length} />
      </div>
    </section>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-xs uppercase tracking-[0.15em] text-cyan/60">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-white/10">
        <motion.div className="h-full bg-cyan" initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function Box({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-cyan/15 bg-black/25 p-3">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="uppercase tracking-[0.16em] text-cyan/45">{label}</div>
    </div>
  );
}

function abilityCount(restoredCount: number) {
  return 1 + Number(restoredCount >= 5) + Number(restoredCount >= 20) + Number(restoredCount >= 50) + Number(restoredCount >= 90);
}
