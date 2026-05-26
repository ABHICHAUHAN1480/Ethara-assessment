"use client";

import { motion } from "framer-motion";
import { Pause, Play, Settings, Trophy } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { ActionButton } from "@/components/ui/ActionButton";
import { HoloPanel } from "@/components/ui/HoloPanel";

export function PauseMenu() {
  const togglePause = useGameStore((state) => state.togglePause);
  const setScreen = useGameStore((state) => state.setScreen);
  const autosave = useGameStore((state) => state.autosave);

  return (
    <motion.div
      className="fixed inset-0 z-40 grid place-items-center bg-black/68 px-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <HoloPanel className="w-full max-w-md p-6" title="PAUSE MENU">
        <div className="mb-6 flex items-center gap-3">
          <Pause className="h-8 w-8 text-cyan" />
          <div>
            <h2 className="text-2xl font-semibold">Runtime Suspended</h2>
            <p className="font-mono text-sm text-cyan-100/60">AIOS has preserved current sector state.</p>
          </div>
        </div>
        <div className="grid gap-3">
          <ActionButton onClick={togglePause}>
            <Play className="h-4 w-4" /> Resume
          </ActionButton>
          <ActionButton
            variant="quiet"
            onClick={() => {
              togglePause();
              setScreen("settings");
            }}
          >
            <Settings className="h-4 w-4" /> Settings
          </ActionButton>
          <ActionButton
            variant="quiet"
            onClick={() => {
              togglePause();
              setScreen("achievements");
            }}
          >
            <Trophy className="h-4 w-4" /> Achievements
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={() => {
              void autosave();
              togglePause();
              setScreen("mainframe");
            }}
          >
            Return Mainframe
          </ActionButton>
        </div>
      </HoloPanel>
    </motion.div>
  );
}
