"use client";

import { motion } from "framer-motion";
import { aiLinesByMood } from "@/data/dialogue";
import type { Sector } from "@/types/game";

export function AIComms({ sector, pulse }: { sector: Sector; pulse: number }) {
  const lines = aiLinesByMood[sector.aiMood];
  const line = lines[pulse % lines.length];

  return (
    <motion.aside
      className="glass holo-border relative overflow-hidden p-4"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="absolute inset-0 scanlines opacity-20" />
      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan/55">AI Communication</p>
        <div className="mt-3 flex items-center gap-3">
          <motion.div
            className="h-14 w-14 border border-cyan/40 bg-cyan/10 shadow-hologram"
            animate={{ rotate: [0, 4, -3, 0], borderRadius: ["0%", "22%", "0%"] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <div>
            <h3 className="font-display text-xl font-black uppercase text-white">{sector.aiName}</h3>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-warningYellow">{sector.aiMood}</p>
          </div>
        </div>
        <motion.p
          key={`${sector.id}-${pulse}`}
          initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className="mt-5 min-h-20 border-l-2 border-cyan bg-black/35 p-3 font-mono text-lg text-cyan/90"
        >
          "{line}"
        </motion.p>
      </div>
    </motion.aside>
  );
}
