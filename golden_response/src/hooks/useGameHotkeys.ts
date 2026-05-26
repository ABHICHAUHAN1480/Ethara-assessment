"use client";

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

export function useGameHotkeys() {
  const togglePause = useGameStore((state) => state.togglePause);
  const setScreen = useGameStore((state) => state.setScreen);
  const screen = useGameStore((state) => state.screen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (event.key === "Escape") {
        event.preventDefault();
        if (screen === "settings" || screen === "achievements") {
          setScreen("mainframe");
          return;
        }
        togglePause();
      }
      if (!isTyping && event.key.toLowerCase() === "m") {
        setScreen("mainframe");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen, setScreen, togglePause]);
}
