"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

export function useKeyboardShortcuts() {
  const settings = useGameStore((state) => state.settings);
  const screen = useGameStore((state) => state.screen);
  const setScreen = useGameStore((state) => state.setScreen);
  const openSettings = useGameStore((state) => state.openSettings);
  const closeSettings = useGameStore((state) => state.closeSettings);
  const settingsOpen = useGameStore((state) => state.settingsOpen);

  useEffect(() => {
    if (!settings.keyboardControls) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (settingsOpen) {
          closeSettings();
        } else if (screen === "sector") {
          setScreen("mainframe");
        }
      }
      if (event.key.toLowerCase() === "s" && event.altKey) {
        event.preventDefault();
        openSettings();
      }
      if (event.key.toLowerCase() === "m" && event.altKey) {
        event.preventDefault();
        setScreen("mainframe");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSettings, openSettings, screen, setScreen, settings.keyboardControls, settingsOpen]);
}
