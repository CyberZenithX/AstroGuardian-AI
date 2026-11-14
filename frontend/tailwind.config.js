/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: { 0: "#0f0f0e", 1: "#1a1a19", 2: "#242422", 3: "#2f2f2c" },
        line: "#383835",
        ink: { 1: "#f0efec", 2: "#c3c2b7", 3: "#8f8e86" },
        series: "#3987e5",
        status: { good: "#0ca30c", warning: "#fab219", critical: "#d03b3b", unknown: "#8f8e86" },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
