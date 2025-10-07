// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#000000",
        },
      },
      clipPath: {
        arrow: "polygon(0 0,80% 0,100% 50%,80% 100%,0 100%)",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "ml": "875px",   // ✅ custom
      },
      keyframes: {
        pulseScale: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
      },
      animation: {
        pulseScale: "pulseScale 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwind-clip-path"),
  ],
};
