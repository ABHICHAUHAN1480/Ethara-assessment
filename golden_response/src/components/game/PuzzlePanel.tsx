"use client";

import { CheckCircle2, Lightbulb, MoveRight } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { SECTOR_LEVELS, getBandForLevel } from "@/data/sectors";
import { useGameStore } from "@/stores/gameStore";
import { ActionButton } from "@/components/ui/ActionButton";
import { HoloPanel } from "@/components/ui/HoloPanel";

export function PuzzlePanel() {
  const level = useGameStore((state) => state.level);
  const unlockedLevel = useGameStore((state) => state.unlockedLevel);
  const restoredLevels = useGameStore((state) => state.restoredLevels);
  const solvePuzzle = useGameStore((state) => state.solvePuzzle);
  const enterSector = useGameStore((state) => state.enterSector);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const sector = SECTOR_LEVELS[level - 1];
  const band = getBandForLevel(level);
  const restored = restoredLevels.includes(level);
  const payload = useMemo(() => sector.puzzle.payload, [sector.puzzle.payload]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    solvePuzzle(answer);
    setAnswer("");
  };

  return (
    <HoloPanel className="p-4" title="Debugging Puzzle Lattice" accent={band.accent}>
      <div className="mb-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.22em]" style={{ color: band.accent }}>
          {sector.puzzle.kind.replace("-", " ")}
        </div>
        <h2 className="text-xl font-semibold text-white">{sector.title}</h2>
        <p className="mt-2 text-sm leading-6 text-cyan-50/70">{sector.puzzle.prompt}</p>
      </div>
      <div className="mb-4 rounded-md border border-white/10 bg-black/38 p-3 font-mono text-sm text-cyan-50/82">
        {payload.map((line) => (
          <div key={line} className="border-b border-white/5 py-2 last:border-b-0">
            {line}
          </div>
        ))}
      </div>
      {showHint ? <div className="mb-4 rounded-md border border-violet/30 bg-violet/10 p-3 text-sm text-violet-100">{sector.puzzle.hint}</div> : null}
      <form onSubmit={submit} className="grid gap-3">
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="rounded-md border border-cyan/25 bg-black/42 px-3 py-3 font-mono text-sm text-cyan-50 outline-none transition focus:border-cyan"
          placeholder="enter repair answer"
          disabled={restored}
        />
        <div className="flex flex-wrap gap-2">
          <ActionButton type="submit" disabled={restored || answer.trim().length === 0}>
            <CheckCircle2 className="h-4 w-4" /> Commit Patch
          </ActionButton>
          <ActionButton type="button" variant="quiet" onClick={() => setShowHint((value) => !value)}>
            <Lightbulb className="h-4 w-4" /> Hint
          </ActionButton>
          {restored && unlockedLevel > level ? (
            <ActionButton type="button" onClick={() => enterSector(level + 1)}>
              Next Node <MoveRight className="h-4 w-4" />
            </ActionButton>
          ) : null}
        </div>
      </form>
    </HoloPanel>
  );
}
