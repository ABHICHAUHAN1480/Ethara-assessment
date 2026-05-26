import type { SettingsState } from "@/types/game";

export class AudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  initialize(settings: SettingsState): void {
    if (typeof window === "undefined" || this.context) return;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;
    this.context = new AudioContextConstructor();
    this.master = this.context.createGain();
    this.master.gain.value = settings.masterVolume;
    this.master.connect(this.context.destination);
  }

  resume(): void {
    void this.context?.resume();
  }

  updateSettings(settings: SettingsState): void {
    if (this.master) this.master.gain.value = settings.masterVolume;
    if (this.ambientGain) this.ambientGain.gain.value = settings.musicVolume * 0.05;
  }

  startAmbient(settings: SettingsState): void {
    if (!this.context || !this.master || this.ambientOscillator) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = 58;
    gain.gain.value = settings.musicVolume * 0.05;
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start();
    this.ambientOscillator = oscillator;
    this.ambientGain = gain;
  }

  blip(type: "type" | "success" | "error" | "warning" = "type", volume = 1): void {
    if (!this.context || !this.master) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const frequencies = {
      type: 420,
      success: 880,
      error: 110,
      warning: 220
    };
    oscillator.type = type === "error" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(frequencies[type], now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequencies[type] * 0.55), now + 0.11);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045 * volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
