"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { HoloPanel } from "@/components/ui/HoloPanel";
import { useGameStore } from "@/stores/gameStore";

export function CorruptionWarningScreen() {
  const recoverSave = useGameStore((state) => state.recoverSave);
  const enterSector = useGameStore((state) => state.enterSector);
  const lastWarning = useGameStore((state) => state.lastWarning);
  const level = useGameStore((state) => state.level);

  return (
    <div className="grid h-full place-items-center p-5">
      <HoloPanel className="max-w-xl p-6 text-center" title="Corruption Warning" accent="#ff3158">
        <AlertTriangle className="mx-auto mb-4 h-14 w-14 text-pulse" />
        <h1 className="text-3xl font-semibold text-white">System Collapse Imminent</h1>
        <p className="mt-3 text-cyan-50/70">{lastWarning ?? "Corruption pressure exceeded safe execution range."}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ActionButton variant="danger" onClick={() => void recoverSave()}>
            <RotateCcw className="h-4 w-4" /> Recover Save
          </ActionButton>
          <ActionButton onClick={() => enterSector(level)}>Retry Node</ActionButton>
        </div>
      </HoloPanel>
    </div>
  );
}
