import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08111F",
        surface: {
          DEFAULT: "#101C2D",
          raised: "#17263A",
          border: "#1E334D"
        },
        primary: {
          DEFAULT: "#43D9E8",
          hover: "#22C1D1",
          muted: "rgba(67, 217, 232, 0.15)"
        },
        violet: {
          accent: "#8B7CFF",
          muted: "rgba(139, 124, 255, 0.15)"
        },
        severity: {
          critical: "#FF5B67",
          high: "#FF9D4D",
          medium: "#F3C969",
          low: "#4DD4A5",
          undetermined: "#9FB0C5"
        },
        text: {
          primary: "#F4F7FB",
          secondary: "#9FB0C5",
          muted: "#6B7C93"
        }
      },
    },
  },
  plugins: [],
};
export default config;
