"use client";

import { motion } from "framer-motion";
import type { Sector } from "@/types/game";

export function HUD({ sector }: { sector: Sector }) {
  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-30 flex flex-wrap items-start justify-between gap-3 font-mono">
      <div className="glass min-w-64 p-3">
        <div className="text-xs uppercase tracking-[0.24em] text-cyan/55">Sector</div>
        <div className="text-lg font-bold uppercase text-white">{sector.name}</div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <MiniStat label="Corrupt" value={`${sector.corruption}%`} tone="text-glitchRed" />
          <MiniStat label="AI" value={`${sector.aiPresence}%`} tone="text-warningYellow" />
          <MiniStat label="Stable" value={`${sector.stability}%`} tone="text-cyan" />
        </div>
      </div>

      <div className="glass hidden max-w-xl p-3 lg:block">
        <div className="mb-2 text-xs uppercase tracking-[0.24em] text-cyan/55">Objectives</div>
        <div className="flex flex-wrap gap-2">
          {sector.objectives.map((objective) => (
            <span key={objective} className="border border-cyan/20 bg-cyan/5 px-2 py-1 text-xs uppercase tracking-[0.12em] text-cyan/75">
              {objective}
            </span>
          ))}
        </div>
      </div>

      <motion.div className="glass p-3 text-xs uppercase tracking-[0.15em] text-cyan/65" animate={{ opacity: [0.65, 1, 0.65] }} transition={{ repeat: Infinity, duration: 2.4 }}>
        scan repair decrypt trace override stabilize inject
      </motion.div>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div>
      <div className={tone}>{value}</div>
      <div className="text-[0.62rem] uppercase tracking-[0.14em] text-cyan/45">{label}</div>
    </div>
  );
}
