import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        fossil: {
          bg: "#0a0a0b",
          panel: "#121214",
          edge: "#26262b",
          fresh: "#e8e6df",
          fading: "#9a978f",
          critical: "#c2553f",
          terminal: "#ff5d52",
          accent: "#7dd3fc",
        },
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "0.78" },
          "50%": { opacity: "0.42" },
          "55%": { opacity: "0.85" },
          "70%": { opacity: "0.6" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-2px)" },
          "40%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-1px)" },
          "80%": { transform: "translateX(1px)" },
        },
        pulseCta: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.04)" },
        },
      },
      animation: {
        flicker: "flicker 2.4s infinite steps(1)",
        shake: "shake 0.6s infinite",
        pulseCta: "pulseCta 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
