"use client";

import { useEffect } from "react";
import { persistGame } from "@/lib/save";
import { useGameStore } from "@/store/gameStore";

export function useAutosave() {
  const makeSavePayload = useGameStore((state) => state.makeSavePayload);
  const restoredSectors = useGameStore((state) => state.restoredSectors);
  const settings = useGameStore((state) => state.settings);
  const currentSectorId = useGameStore((state) => state.currentSectorId);
  const commandHistory = useGameStore((state) => state.commandHistory);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      persistGame(makeSavePayload());
    }, 350);

    return () => window.clearTimeout(handle);
  }, [makeSavePayload, restoredSectors, settings, currentSectorId, commandHistory]);
}
