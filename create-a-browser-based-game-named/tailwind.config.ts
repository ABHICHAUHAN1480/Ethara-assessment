import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#03040a",
        panel: "rgba(8, 15, 30, 0.68)",
        cyan: "#00f5ff",
        neonBlue: "#287cff",
        holoPurple: "#9a4dff",
        glitchRed: "#ff2d55",
        warningYellow: "#ffd166",
        corruptOrange: "#ff7a1a"
      },
      fontFamily: {
        mono: ["var(--font-jet)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-orbit)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        hologram: "0 0 24px rgba(0, 245, 255, 0.22), inset 0 0 26px rgba(154, 77, 255, 0.12)",
        alarm: "0 0 24px rgba(255, 45, 85, 0.35)"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "43%": { opacity: "0.75" },
          "46%": { opacity: "0.2" },
          "49%": { opacity: "0.92" },
          "76%": { opacity: "0.45" },
          "80%": { opacity: "1" }
        },
        cursor: {
          "0%, 47%": { opacity: "1" },
          "48%, 100%": { opacity: "0" }
        }
      },
      animation: {
        scan: "scan 5s linear infinite",
        flicker: "flicker 2.6s steps(1) infinite",
        cursor: "cursor 1s steps(1) infinite"
      }
    }
  },
  plugins: []
};

export default config;
