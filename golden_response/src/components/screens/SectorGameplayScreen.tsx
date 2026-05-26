"use client";

import { Menu, RadioTower } from "lucide-react";
import { PuzzlePanel } from "@/components/game/PuzzlePanel";
import { TerminalInterface } from "@/components/game/TerminalInterface";
import { DigitalSectorScene } from "@/components/three/DigitalSectorScene";
import { AIDialogue } from "@/components/ui/AIDialogue";
import { ActionButton } from "@/components/ui/ActionButton";
import { HUD } from "@/components/ui/HUD";
import { getBandForLevel } from "@/data/sectors";
import { useGameStore } from "@/stores/gameStore";

export function SectorGameplayScreen() {
  const level = useGameStore((state) => state.level);
  const togglePause = useGameStore((state) => state.togglePause);
  const band = getBandForLevel(level);

  return (
    <div className="relative h-full overflow-hidden">
      <DigitalSectorScene />
      <HUD />
      <div className="absolute bottom-0 left-0 right-0 top-20 z-10 overflow-y-auto p-4 terminal-scroll md:p-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(320px,0.8fr)_minmax(360px,1fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <div className="holo-panel rounded-lg p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: band.accent }}>
                  {band.title}
                </div>
                <RadioTower className="h-5 w-5" style={{ color: band.accent }} />
              </div>
              <p className="text-sm leading-6 text-cyan-50/72">{band.theme}</p>
              <p className="mt-3 text-sm leading-6 text-cyan-50/60">{band.visual}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${level}%`, background: `linear-gradient(90deg, ${band.accent}, ${band.secondary})` }} />
              </div>
            </div>
            <AIDialogue />
            <ActionButton variant="quiet" onClick={togglePause} className="w-full">
              <Menu className="h-4 w-4" /> Pause
            </ActionButton>
          </div>
          <TerminalInterface />
          <PuzzlePanel />
        </div>
      </div>
    </div>
  );
}
