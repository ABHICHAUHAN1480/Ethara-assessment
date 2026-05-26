"use client";

import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import { ActionButton } from "@/components/ui/ActionButton";

export function BootScreen() {
  const startIntro = useGameStore((state) => state.startIntro);
  const lines = useMemo(
    () => [
      "AIOS KERNEL 9.8.1 EMERGENCY MODE",
      "Developer registry: empty",
      "Human biosignal: detected",
      "Corruption lattice: expanding",
      "Operator permission: improvised",
      "ERROR: HUMAN_FOUND"
    ],
    []
  );

  return (
    <div className="grid h-full place-items-center px-6">
      <div className="w-full max-w-4xl">
        <motion.h1
          data-text="ERROR: HUMAN_FOUND"
          className="glitch-text mb-8 text-center font-mono text-4xl font-bold uppercase tracking-[0.22em] text-cyan md:text-7xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          ERROR: HUMAN_FOUND
        </motion.h1>
        <div className="holo-panel mx-auto max-w-2xl rounded-lg p-5 font-mono text-sm text-cyan-50/82">
          {lines.map((line, index) => (
            <motion.div
              key={line}
              className="flex items-center justify-between border-b border-cyan/10 py-2 last:border-b-0"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.16 }}
            >
              <span>{line}</span>
              <span className={index === lines.length - 1 ? "text-pulse" : "text-matrix"}>{index === lines.length - 1 ? "ALERT" : "OK"}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <ActionButton onClick={startIntro}>
            <Power className="h-4 w-4" /> Boot Emergency Interface
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
