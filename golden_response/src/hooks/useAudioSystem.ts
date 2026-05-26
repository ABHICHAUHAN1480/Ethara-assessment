"use client";

import { useEffect, useMemo } from "react";
import { AudioEngine } from "@/lib/audioEngine";
import { useGameStore } from "@/stores/gameStore";

export function useAudioSystem() {
  const settings = useGameStore((state) => state.settings);
  const engine = useMemo(() => new AudioEngine(), []);

  useEffect(() => {
    const activate = () => {
      engine.initialize(settings);
      engine.resume();
      engine.startAmbient(settings);
    };
    window.addEventListener("pointerdown", activate, { once: true });
    window.addEventListener("keydown", activate, { once: true });
    return () => {
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [engine, settings]);

  useEffect(() => {
    engine.updateSettings(settings);
  }, [engine, settings]);

  return engine;
}
