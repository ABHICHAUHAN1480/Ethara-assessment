"use client";

import { ArrowLeft, Lock, Trophy } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { HoloPanel } from "@/components/ui/HoloPanel";
import { useGameStore } from "@/stores/gameStore";

export function AchievementsScreen() {
  const achievements = useGameStore((state) => state.achievements);
  const setScreen = useGameStore((state) => state.setScreen);

  return (
    <div className="h-full overflow-y-auto p-5 pt-10 terminal-scroll">
      <div className="mx-auto max-w-5xl">
        <ActionButton variant="quiet" onClick={() => setScreen("mainframe")}>
          <ArrowLeft className="h-4 w-4" /> Mainframe
        </ActionButton>
        <HoloPanel className="mt-5 p-6" title="Achievements">
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => {
              const unlocked = Boolean(achievement.unlockedAt);
              return (
                <article key={achievement.id} className={`rounded-md border p-4 ${unlocked ? "border-cyan/35 bg-cyan/8" : "border-white/10 bg-white/[0.035]"}`}>
                  <div className="mb-3 flex items-center gap-3">
                    {unlocked ? <Trophy className="h-5 w-5 text-cyan" /> : <Lock className="h-5 w-5 text-cyan-100/35" />}
                    <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-white">{achievement.title}</h2>
                  </div>
                  <p className="text-sm leading-6 text-cyan-50/66">{achievement.description}</p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100/45">
                    {unlocked && achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleString() : "Locked"}
                  </p>
                </article>
              );
            })}
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}
