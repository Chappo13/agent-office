import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#4f5bd5",
        "brand-dark": "#3f4bc5",
        "brand-tint": "#eef0fb",
        ink: "#1a1f36",
        "ink-muted": "#6b7291",
        canvas: "#fafbfc",
        panel: "#ffffff",
        sidebar: "#f7f8fb",
        surface: "#eef1f6",
        line: "#e4e8f0",
        success: "#22c55e",
        amber: "#f59e0b",
      },
      fontFamily: {
        display: [
          '"Pixelify Sans"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(26,31,54,0.04), 0 8px 24px -12px rgba(26,31,54,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
