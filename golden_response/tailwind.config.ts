import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#03040a",
        ink: "#080b16",
        cyan: "#00f6ff",
        violet: "#9a4dff",
        pulse: "#ff3158",
        matrix: "#5cff9d"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"]
      },
      boxShadow: {
        holo: "0 0 24px rgba(0, 246, 255, 0.22), inset 0 0 28px rgba(154, 77, 255, 0.12)",
        alert: "0 0 36px rgba(255, 49, 88, 0.32)"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "40%": { opacity: "0.82" },
          "42%": { opacity: "0.45" },
          "44%": { opacity: "0.95" }
        },
        drift: {
          "0%": { transform: "translate3d(-2%, -1%, 0) scale(1)" },
          "50%": { transform: "translate3d(2%, 1%, 0) scale(1.02)" },
          "100%": { transform: "translate3d(-2%, -1%, 0) scale(1)" }
        }
      },
      animation: {
        scan: "scan 5s linear infinite",
        flicker: "flicker 3.7s infinite",
        drift: "drift 9s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
