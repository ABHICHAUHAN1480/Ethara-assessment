"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";

export function AIDialogue() {
  const message = useGameStore((state) => state.aiMessage);
  const mood = useGameStore((state) => state.aiMood);
  const aiEvolution = useGameStore((state) => state.aiEvolution);
  const color = {
    curious: "#00f6ff",
    hostile: "#ff3158",
    afraid: "#ffffff",
    allied: "#5cff9d"
  }[mood];

  return (
    <motion.aside
      key={message}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="holo-panel rounded-lg p-4"
      style={{ borderColor: `${color}66` }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em]" style={{ color }}>
          <BrainCircuit className="h-4 w-4" />
          AI Entity / {mood}
        </div>
        <div className="font-mono text-xs text-cyan-100/50">EVO {aiEvolution}%</div>
      </div>
      <p className="text-sm leading-6 text-cyan-50/86">{message}</p>
    </motion.aside>
  );
}
