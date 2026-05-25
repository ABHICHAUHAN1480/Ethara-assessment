"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type HolographicButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "danger" | "quiet";
};

export function HolographicButton({ children, variant = "primary", className = "", ...props }: HolographicButtonProps) {
  const variantClass =
    variant === "danger"
      ? "border-glitchRed/60 text-glitchRed hover:bg-glitchRed/15"
      : variant === "quiet"
        ? "border-white/20 text-cyan/80 hover:bg-white/10"
        : "border-cyan/60 text-cyan hover:bg-cyan/15";

  return (
    <motion.button
      whileHover={{ scale: 1.025, x: 2 }}
      whileTap={{ scale: 0.97 }}
      className={[
        "group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden border bg-black/30 px-4 py-2 font-mono text-sm uppercase tracking-[0.2em] outline-none transition focus-visible:ring-2 focus-visible:ring-cyan",
        variantClass,
        className
      ].join(" ")}
      {...props}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-current opacity-60 transition group-hover:w-full group-hover:opacity-10" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
