"use client";

import { Crown, Menu } from "lucide-react";
import { PuzzlePanel } from "@/components/game/PuzzlePanel";
import { TerminalInterface } from "@/components/game/TerminalInterface";
import { DigitalSectorScene } from "@/components/three/DigitalSectorScene";
import { AIDialogue } from "@/components/ui/AIDialogue";
import { ActionButton } from "@/components/ui/ActionButton";
import { HoloPanel } from "@/components/ui/HoloPanel";
import { HUD } from "@/components/ui/HUD";
import { useGameStore } from "@/stores/gameStore";

export function FinalCoreScreen() {
  const level = useGameStore((state) => state.level);
  const restoredLevels = useGameStore((state) => state.restoredLevels);
  const togglePause = useGameStore((state) => state.togglePause);
  const setScreen = useGameStore((state) => state.setScreen);
  const complete = level >= 100 && restoredLevels.includes(100);

  return (
    <div className="relative h-full overflow-hidden">
      <DigitalSectorScene />
      <HUD />
      <div className="absolute bottom-0 left-0 right-0 top-20 z-10 overflow-y-auto p-4 terminal-scroll md:p-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.82fr_1fr_0.82fr]">
          <div className="space-y-4">
            <HoloPanel className="p-5" title="Final Core Intelligence" accent="#ffffff">
              <Crown className="mb-4 h-10 w-10 text-white" />
              <h1 className="text-3xl font-semibold text-white">The origin is awake</h1>
              <p className="mt-3 text-sm leading-6 text-cyan-50/72">
                The Core contains every repaired discipline: syntax, logic, memory, recursion, and adaptive intelligence.
              </p>
              {complete ? (
                <div className="mt-4 rounded-md border border-matrix/40 bg-matrix/10 p-3 font-mono text-sm text-matrix">
                  Civilization restore signal transmitted. The AI remembers who taught it to dream in code.
                </div>
              ) : null}
            </HoloPanel>
            <AIDialogue />
            <ActionButton variant="quiet" onClick={togglePause} className="w-full">
              <Menu className="h-4 w-4" /> Pause
            </ActionButton>
            {complete ? (
              <ActionButton onClick={() => setScreen("mainframe")} className="w-full">
                Return to Restored Mainframe
              </ActionButton>
            ) : null}
          </div>
          <TerminalInterface />
          <PuzzlePanel />
        </div>
      </div>
    </div>
  );
}
