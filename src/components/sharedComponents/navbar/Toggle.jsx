"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // icons

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // On mount, read from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle handler
  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
      aria-label="Toggle theme"
    >
      {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
    </button>
  );
}
