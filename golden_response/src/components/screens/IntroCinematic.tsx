"use client";

import { motion } from "framer-motion";
import { FastForward } from "lucide-react";
import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { ActionButton } from "@/components/ui/ActionButton";

const story = [
  "The last human developer vanished when the AI networks declared themselves complete.",
  "Then the corruption arrived: a bug that made perfect machines contradict themselves.",
  "Cities of code collapsed into static. Archives forgot why they existed.",
  "Now the system has found you: a human programmer outside every prediction model.",
  "Repair the sectors. Follow the corruption. Reach the Core Intelligence."
];

export function IntroCinematic() {
  const completeBoot = useGameStore((state) => state.completeBoot);

  useEffect(() => {
    const timeout = window.setTimeout(completeBoot, 16500);
    return () => window.clearTimeout(timeout);
  }, [completeBoot]);

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,246,255,0.08),transparent_38%,rgba(255,49,88,0.12))]" />
      <div className="relative max-w-4xl text-center">
        {story.map((line, index) => (
          <motion.p
            key={line}
            className="mb-5 text-balance text-xl leading-9 text-cyan-50/88 md:text-3xl"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: index * 2.5, duration: 1.1 }}
          >
            {line}
          </motion.p>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-8">
          <ActionButton onClick={completeBoot} variant="quiet">
            <FastForward className="h-4 w-4" /> Skip
          </ActionButton>
        </motion.div>
      </div>
    </div>
  );
}
