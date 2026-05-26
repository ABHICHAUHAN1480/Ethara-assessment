"use client";

import { ArrowLeft, Volume2 } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { HoloPanel } from "@/components/ui/HoloPanel";
import { useGameStore } from "@/stores/gameStore";

export function SettingsScreen() {
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const setScreen = useGameStore((state) => state.setScreen);

  return (
    <div className="h-full overflow-y-auto p-5 pt-10 terminal-scroll">
      <div className="mx-auto max-w-3xl">
        <ActionButton variant="quiet" onClick={() => setScreen("mainframe")}>
          <ArrowLeft className="h-4 w-4" /> Mainframe
        </ActionButton>
        <HoloPanel className="mt-5 p-6" title="Settings">
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/65">Graphics Profile</label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "balanced", "ultra"] as const).map((profile) => (
                  <button
                    key={profile}
                    onClick={() => updateSettings({ graphics: profile })}
                    className={`rounded-md border px-3 py-3 font-mono text-xs uppercase tracking-[0.16em] transition ${
                      settings.graphics === profile ? "border-cyan bg-cyan/18 text-white" : "border-white/12 bg-white/5 text-cyan-100/70 hover:bg-white/10"
                    }`}
                  >
                    {profile}
                  </button>
                ))}
              </div>
            </div>
            <Toggle label="Reduced Motion" value={settings.reducedMotion} onChange={(value) => updateSettings({ reducedMotion: value })} />
            <Toggle label="Scanline Overlay" value={settings.scanlines} onChange={(value) => updateSettings({ scanlines: value })} />
            <Slider label="Master Volume" value={settings.masterVolume} onChange={(value) => updateSettings({ masterVolume: value })} />
            <Slider label="Music Volume" value={settings.musicVolume} onChange={(value) => updateSettings({ musicVolume: value })} />
            <Slider label="SFX Volume" value={settings.sfxVolume} onChange={(value) => updateSettings({ sfxVolume: value })} />
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/10">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/70">{label}</span>
      <span className={`h-6 w-11 rounded-full border p-0.5 transition ${value ? "border-cyan bg-cyan/20" : "border-white/20 bg-white/10"}`}>
        <span className={`block h-4 w-4 rounded-full transition ${value ? "translate-x-5 bg-cyan" : "bg-white/45"}`} />
      </span>
    </button>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/70">
          <Volume2 className="h-4 w-4 text-cyan" /> {label}
        </span>
        <span className="font-mono text-sm text-white">{Math.round(value * 100)}%</span>
      </div>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-cyan" />
    </label>
  );
}
