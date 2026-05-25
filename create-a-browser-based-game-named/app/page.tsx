"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BootScreen } from "@/components/BootScreen";
import { IntroCinematic } from "@/components/IntroCinematic";
import { Mainframe } from "@/components/Mainframe";
import { SectorGameplay } from "@/components/SectorGameplay";
import { SettingsModal } from "@/components/SettingsModal";
import { useAutosave } from "@/hooks/useAutosave";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useGameStore } from "@/store/gameStore";
import { initializePersistence } from "@/lib/save";

const AIOperatingSystemScene = dynamic(
  () => import("@/components/three/AIOperatingSystemScene").then((mod) => mod.AIOperatingSystemScene),
  { ssr: false }
);

export default function GamePage() {
  const screen = useGameStore((state) => state.screen);
  const settingsOpen = useGameStore((state) => state.settingsOpen);
  const hydrate = useGameStore((state) => state.hydrate);
  const hydrated = useGameStore((state) => state.hydrated);
  const settings = useGameStore((state) => state.settings);

  useAutosave();
  useKeyboardShortcuts();

  useEffect(() => {
    initializePersistence().then(hydrate);
  }, [hydrate]);

  return (
    <main
      className={[
        "relative min-h-dvh overflow-hidden bg-void text-cyan selection:bg-cyan selection:text-black",
        settings.highContrast ? "high-contrast" : "",
        settings.colorblindMode ? "colorblind" : "",
        settings.reducedMotion ? "reduced-motion" : ""
      ].join(" ")}
      style={{ ["--ui-scale" as string]: settings.uiScale }}
    >
      <AIOperatingSystemScene />
      <div className="fixed inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(40,124,255,0.18),transparent_34%),linear-gradient(120deg,rgba(154,77,255,0.12),transparent_46%),linear-gradient(180deg,rgba(3,4,10,0.12),rgba(3,4,10,0.82))]" />
      <div className="fixed inset-0 z-40 pointer-events-none scanlines opacity-50" />
      <div className="fixed inset-x-0 top-0 z-40 h-24 pointer-events-none bg-gradient-to-b from-cyan/10 to-transparent" />

      {!hydrated && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-void font-mono text-sm tracking-[0.28em] text-cyan"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          LINKING LOCAL MEMORY...
        </motion.div>
      )}

      <section className="relative z-20 min-h-dvh scale-shell">
        <AnimatePresence mode="wait">
          {screen === "boot" && <BootScreen key="boot" />}
          {screen === "intro" && <IntroCinematic key="intro" />}
          {screen === "mainframe" && <Mainframe key="mainframe" />}
          {screen === "sector" && <SectorGameplay key="sector" />}
        </AnimatePresence>
      </section>

      <AnimatePresence>{settingsOpen && <SettingsModal />}</AnimatePresence>
    </main>
  );
}
