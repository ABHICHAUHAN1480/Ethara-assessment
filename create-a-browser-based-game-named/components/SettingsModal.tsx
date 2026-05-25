"use client";

import { motion } from "framer-motion";
import { MonitorCog, Volume2, X } from "lucide-react";
import type { ReactNode } from "react";
import { audioEngine } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";
import type { GameSettings } from "@/types/game";
import { HolographicButton } from "@/components/HolographicButton";

export function SettingsModal() {
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const closeSettings = useGameStore((state) => state.closeSettings);
  const resetRun = useGameStore((state) => state.resetRun);

  const patch = (value: Partial<GameSettings>) => {
    updateSettings(value);
    audioEngine.configure({ ...settings, ...value });
    audioEngine.pulse("typing");
  };

  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/72 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section
        className="glass holo-border w-full max-w-3xl p-5"
        initial={{ y: 30, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.96 }}
      >
        <div className="mb-5 flex items-center justify-between border-b border-cyan/20 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan/55">System Controls</p>
            <h2 className="font-display text-2xl font-black uppercase text-white">Settings</h2>
          </div>
          <button
            onClick={closeSettings}
            className="grid h-11 w-11 place-items-center border border-cyan/30 bg-black/30 text-cyan outline-none transition hover:bg-cyan/10 focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label="Close settings"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="Audio" icon={<Volume2 size={17} />}>
            <Toggle label="Music" value={settings.music} onChange={(value) => patch({ music: value })} />
            <Toggle label="Interface SFX" value={settings.sfx} onChange={(value) => patch({ sfx: value })} />
          </Panel>

          <Panel title="Accessibility" icon={<MonitorCog size={17} />}>
            <Toggle label="Subtitles" value={settings.subtitles} onChange={(value) => patch({ subtitles: value })} />
            <Toggle label="Reduced Motion" value={settings.reducedMotion} onChange={(value) => patch({ reducedMotion: value })} />
            <Toggle label="High Contrast" value={settings.highContrast} onChange={(value) => patch({ highContrast: value })} />
            <Toggle label="Colorblind Assistance" value={settings.colorblindMode} onChange={(value) => patch({ colorblindMode: value })} />
            <Toggle label="Keyboard Controls" value={settings.keyboardControls} onChange={(value) => patch({ keyboardControls: value })} />
          </Panel>

          <Panel title="Graphics" icon={<MonitorCog size={17} />}>
            <div className="grid grid-cols-3 gap-2">
              {(["eco", "balanced", "ultra"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => patch({ graphics: mode })}
                  className={[
                    "border px-2 py-2 font-mono text-xs uppercase tracking-[0.12em] outline-none focus-visible:ring-2 focus-visible:ring-cyan",
                    settings.graphics === mode ? "border-cyan bg-cyan/15 text-cyan" : "border-cyan/20 bg-black/25 text-cyan/55"
                  ].join(" ")}
                >
                  {mode}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Scale UI" icon={<MonitorCog size={17} />}>
            <input
              type="range"
              min={0.88}
              max={1.08}
              step={0.01}
              value={settings.uiScale}
              onChange={(event) => patch({ uiScale: Number(event.target.value) })}
              className="w-full accent-cyan"
              aria-label="Scale UI"
            />
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan/55">{Math.round(settings.uiScale * 100)}%</div>
          </Panel>
        </div>

        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-cyan/20 pt-4">
          <HolographicButton variant="danger" onClick={resetRun}>
            Reset Simulation
          </HolographicButton>
          <HolographicButton onClick={closeSettings}>Apply</HolographicButton>
        </div>
      </motion.section>
    </motion.div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="border border-cyan/15 bg-black/25 p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-cyan/60">
        {icon} {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 font-mono text-sm uppercase tracking-[0.12em] text-cyan/75">
      <span>{label}</span>
      <input className="sr-only" type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
      <span className={["relative h-6 w-11 border transition", value ? "border-cyan bg-cyan/20" : "border-white/20 bg-black/35"].join(" ")}>
        <span className={["absolute top-1 h-4 w-4 bg-current transition", value ? "left-6 text-cyan" : "left-1 text-white/40"].join(" ")} />
      </span>
    </label>
  );
}
