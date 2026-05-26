import type { ReactNode } from "react";

interface HoloPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  accent?: string;
}

export function HoloPanel({ children, className = "", title, accent = "#00f6ff" }: HoloPanelProps) {
  return (
    <section className={`holo-panel relative overflow-hidden rounded-lg ${className}`} style={{ borderColor: `${accent}55` }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl" style={{ background: `${accent}22` }} />
      {title ? (
        <div className="border-b border-cyan/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-cyan-100/80">
          {title}
        </div>
      ) : null}
      {children}
    </section>
  );
}
