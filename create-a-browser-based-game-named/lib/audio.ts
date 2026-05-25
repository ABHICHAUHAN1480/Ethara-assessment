import type { GameSettings } from "@/types/game";

class AudioEngine {
  private context: AudioContext | null = null;
  private drone: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private settings: GameSettings | null = null;

  configure(settings: GameSettings) {
    this.settings = settings;
    if (!settings.music) {
      this.stopDrone();
    }
  }

  async prime() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this.context) {
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
    if (this.settings?.music) {
      this.startDrone();
    }
  }

  startDrone() {
    if (!this.context || this.drone || this.settings?.music === false) {
      return;
    }
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.025;
    this.drone = this.context.createOscillator();
    this.drone.frequency.value = 56;
    this.drone.type = "sawtooth";
    this.drone.connect(this.gain).connect(this.context.destination);
    this.drone.start();
  }

  stopDrone() {
    this.drone?.stop();
    this.drone?.disconnect();
    this.gain?.disconnect();
    this.drone = null;
    this.gain = null;
  }

  pulse(type: "typing" | "glitch" | "success" | "alarm") {
    if (!this.context || this.settings?.sfx === false) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const frequency = type === "typing" ? 760 : type === "glitch" ? 132 : type === "success" ? 980 : 220;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.45), now + 0.08);
    oscillator.type = type === "alarm" ? "square" : "triangle";
    gain.gain.setValueAtTime(type === "alarm" ? 0.09 : 0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
  }
}

export const audioEngine = new AudioEngine();
