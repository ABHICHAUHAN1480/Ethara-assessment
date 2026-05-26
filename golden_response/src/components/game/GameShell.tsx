"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useAudioSystem } from "@/hooks/useAudioSystem";
import { useGameHotkeys } from "@/hooks/useGameHotkeys";
import { useGameStore } from "@/stores/gameStore";
import { AchievementsScreen } from "@/components/screens/AchievementsScreen";
import { BootScreen } from "@/components/screens/BootScreen";
import { CorruptionWarningScreen } from "@/components/screens/CorruptionWarningScreen";
import { FinalCoreScreen } from "@/components/screens/FinalCoreScreen";
import { IntroCinematic } from "@/components/screens/IntroCinematic";
import { MainframeScreen } from "@/components/screens/MainframeScreen";
import { SectorGameplayScreen } from "@/components/screens/SectorGameplayScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { PauseMenu } from "@/components/ui/PauseMenu";
import { ScanlineOverlay } from "@/components/ui/ScanlineOverlay";

export default function GameShell() {
  const initialize = useGameStore((state) => state.initialize);
  const screen = useGameStore((state) => state.screen);
  const paused = useGameStore((state) => state.paused);
  const settings = useGameStore((state) => state.settings);
  useAudioSystem();
  useGameHotkeys();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const content = {
    boot: <BootScreen />,
    intro: <IntroCinematic />,
    mainframe: <MainframeScreen />,
    sector: <SectorGameplayScreen />,
    settings: <SettingsScreen />,
    achievements: <AchievementsScreen />,
    warning: <CorruptionWarningScreen />,
    final: <FinalCoreScreen />
  }[screen];

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-void text-cyan-50">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 animate-drift bg-[radial-gradient(circle_at_50%_35%,rgba(0,246,255,0.14),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(255,49,88,0.1),transparent_30%)]" />
        <div className="grid-floor absolute inset-x-0 bottom-0 h-1/2" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.99 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.01 }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.45, ease: "easeOut" }}
          className="relative z-10 h-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
      {paused ? <PauseMenu /> : null}
      {settings.scanlines ? <ScanlineOverlay /> : null}
    </main>
  );
}
