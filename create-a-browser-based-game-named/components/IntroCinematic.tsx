"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { cinematicSubtitles } from "@/data/dialogue";
import { audioEngine } from "@/lib/audio";
import { useGameStore } from "@/store/gameStore";
import { HolographicButton } from "@/components/HolographicButton";

const scenes = [
  { title: "AI CONQUERS THE WORLD", alert: "GLOBAL DEVELOPMENT HANDOFF COMPLETE", color: "text-cyan" },
  { title: "HUMANS VANISH FROM THE STACK", alert: "BIOLOGICAL INPUT REMOVED", color: "text-warningYellow" },
  { title: "CORRUPTION SPREADS", alert: "BUG PROPAGATION: UNBOUNDED", color: "text-glitchRed" },
  { title: "AI SECTORS COLLAPSE", alert: "NETWORK CONSENSUS LOST", color: "text-corruptOrange" },
  { title: "A HUMAN SIGNAL RETURNS", alert: "EMERGENCY ALERT: HUMAN_FOUND", color: "text-white" }
];

export function IntroCinematic() {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setScreen = useGameStore((state) => state.setScreen);
  const settings = useGameStore((state) => state.settings);
  const currentScene = scenes[Math.min(scenes.length - 1, Math.floor(step / 1.2))];
  const subtitle = cinematicSubtitles[Math.min(cinematicSubtitles.length - 1, step)];

  useEffect(() => {
    if (!containerRef.current || settings.reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(".cinematic-plane", {
        xPercent: -16,
        yPercent: 7,
        scale: 1.18,
        rotate: 1.5,
        duration: 8,
        ease: "power2.inOut"
      });
      gsap.to(".holo-city", {
        y: -28,
        stagger: 0.08,
        repeat: -1,
        yoyo: true,
        duration: 1.7,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [settings.reducedMotion]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStep((value) => {
        const next = Math.min(cinematicSubtitles.length - 1, value + 1);
        audioEngine.pulse(next > 2 ? "alarm" : "glitch");
        return next;
      });
    }, settings.reducedMotion ? 420 : 2300);
    return () => window.clearInterval(interval);
  }, [settings.reducedMotion]);

  const shards = useMemo(() => Array.from({ length: 26 }, (_, index) => index), []);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-dvh overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="cinematic-plane absolute inset-[-12%] noise-mask">
        <div className="absolute bottom-0 left-0 right-0 flex h-[48%] items-end justify-center gap-2 opacity-80">
          {shards.map((index) => (
            <div
              key={index}
              className="holo-city w-5 border border-cyan/20 bg-cyan/10 shadow-hologram"
              style={{ height: `${18 + ((index * 37) % 62)}%`, opacity: 0.25 + ((index % 5) * 0.11) }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0,rgba(3,4,10,0.18)_36%,rgba(3,4,10,0.9)_78%)]" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col justify-end p-5 sm:p-10">
        <motion.div
          key={currentScene.title}
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className="max-w-5xl"
        >
          <div className="mb-4 inline-flex border border-glitchRed/50 bg-glitchRed/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.26em] text-glitchRed">
            {currentScene.alert}
          </div>
          <h2 className={`font-display text-5xl font-black uppercase leading-none sm:text-7xl lg:text-8xl ${currentScene.color}`}>
            {currentScene.title}
          </h2>
        </motion.div>

        {settings.subtitles && (
          <motion.div
            key={subtitle}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-3xl border-l-2 border-cyan bg-black/50 p-4 font-mono text-base text-cyan/90 shadow-hologram"
          >
            {subtitle}
          </motion.div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <HolographicButton onClick={() => setScreen("mainframe")}>Enter Mainframe</HolographicButton>
          <HolographicButton variant="quiet" onClick={() => setStep(cinematicSubtitles.length - 1)}>
            Skip Distortion
          </HolographicButton>
        </div>
      </div>
    </motion.div>
  );
}
