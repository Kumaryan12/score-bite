import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#53F3A3",
        limepop: "#B7F46A",
        salsa: "#FF6B6B",
        mustard: "#FFD166",
        skybite: "#70D6FF",
        ink: "#F8FAFC"
      },
      boxShadow: {
        card: "0 18px 60px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
