/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        /* --- Brand palette (hsl-var pattern enables opacity modifiers) --- */
        ivory: "hsl(var(--ivory) / <alpha-value>)",
        cream: "hsl(var(--cream) / <alpha-value>)",
        beige: "hsl(var(--beige) / <alpha-value>)",
        espresso: "hsl(var(--espresso) / <alpha-value>)",
        brown: "hsl(var(--brown) / <alpha-value>)",
        taupe: "hsl(var(--taupe) / <alpha-value>)",
        gold: "hsl(var(--gold) / <alpha-value>)",
        sage: "hsl(var(--sage) / <alpha-value>)",
        clay: "hsl(var(--clay) / <alpha-value>)",

        /* --- Semantic tokens --- */
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-raised": "hsl(var(--surface-raised) / <alpha-value>)",
        "surface-hover": "hsl(var(--surface-hover) / <alpha-value>)",
        muted: "hsl(var(--foreground-muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--foreground-faint) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          hover: "hsl(var(--primary-hover) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          hover: "hsl(var(--accent-hover) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        "border-strong": "hsl(var(--border-strong) / <alpha-value>)",
        input: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--surface-raised) / <alpha-value>)",
          foreground: "hsl(var(--foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--surface-raised) / <alpha-value>)",
          foreground: "hsl(var(--foreground) / <alpha-value>)",
        },

        /* --- Legacy luxury aliases (raw hex so opacity modifiers keep
               working for pages that still reference luxury-* classes) --- */
        luxury: {
          ivory: "#F7F5F1",
          beige: "#E7E1D8",
          charcoal: "#2E2925",
          brown: "#4B372A",
          gold: "#B99B6B",
          cream: "#FBF9F6",
          taupe: "#8C8279",
          sage: "#9DA99B",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      opacity: {
        12: "0.12",
        15: "0.15",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
        85: "0.85",
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
      },
      transitionTimingFunction: {
        luxury: "var(--ease-luxury)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s var(--ease-luxury)",
        "fade-in-up": "fade-in-up 0.7s var(--ease-luxury)",
        "scale-in": "scale-in 0.4s var(--ease-luxury)",
        "slide-up": "slide-up 0.5s var(--ease-luxury)",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
