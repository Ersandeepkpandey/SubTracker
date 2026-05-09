import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0D9E75",
          50: "#E6F7F2",
          100: "#BEEADE",
          500: "#0D9E75",
          600: "#0B8A66",
          700: "#097557",
        },
        background: "#F9F9F8",
        surface: "#FFFFFF",
        "text-primary": "#1A1A1A",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        input: "8px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
