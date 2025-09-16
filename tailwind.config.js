/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // if you’re using App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // if you also use Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", 
  ],
  // darkMode: "class", // enables light/dark mode via 'dark' class
  theme: {
    extend: {
        colors: {
          background: {
    light: "#ffffff",
    dark: "#000000",
  },
      },
    },
    screens: {
      xs: "480px",   // custom breakpoint
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
}

