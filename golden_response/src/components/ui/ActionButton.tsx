import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "danger" | "quiet";
}

export function ActionButton({ children, variant = "primary", className = "", ...props }: ActionButtonProps) {
  const styles = {
    primary: "border-cyan/50 bg-cyan/10 text-cyan-50 hover:bg-cyan/20 hover:shadow-holo",
    danger: "border-pulse/60 bg-pulse/10 text-red-50 hover:bg-pulse/20 hover:shadow-alert",
    quiet: "border-white/15 bg-white/5 text-cyan-50/80 hover:bg-white/10"
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 font-mono text-sm uppercase tracking-[0.18em] transition ${styles[variant]} disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
