import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          light: "hsl(var(--foreground-light))",
          muted: "hsl(var(--foreground-muted))",
        },
        background: "hsl(var(--background))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        ring: "hsl(var(--ring))",
      },
      animation: {
        ripple: "ripple 600ms linear",
      },
      keyframes: {
        ripple: {
          "0%": { opacity: "40%", transform: "scale(0)" },
          "100%": { opacity: "0%", transform: "scale(3)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
