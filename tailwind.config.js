/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // Pages Router
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  // darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#000000",
        },
      },
      clipPath: {
        // custom arrow-tip shape for banner text box
        arrow: "polygon(0 0,80% 0,100% 50%,80% 100%,0 100%)",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    require("tailwind-clip-path"), // add the clip-path plugin
  ],
};
