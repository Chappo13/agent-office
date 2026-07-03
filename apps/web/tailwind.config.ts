import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#4f5bd5",
        ink: "#1a1f36",
        canvas: "#fafbfc",
        surface: "#f0f2f7",
        success: "#22c55e",
      },
    },
  },
  plugins: [],
};

export default config;
