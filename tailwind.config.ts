import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4F46E5",
        secondary: "#7C3AED",
        dark: "#0B1120",
      },
      backgroundColor: {
        dark: "#0B1120",
      },
    },
  },
  plugins: [],
};

export default config;
