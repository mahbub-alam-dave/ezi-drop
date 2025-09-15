"use client";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";

export default function Navbar() {
const [dark, setDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark"); // 👈 add class here
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  return (
    <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center h-[100px]">
        <h1 className="text-2xl font-bold">Ezi Drop </h1>
        <div className="flex items-center gap-8">
          <nav>
            <ul className="md:flex gap-8 hidden">
              <li>Home</li>
              <li>Send Parcel</li>
              <li>Dashboard</li>
              <li>About</li>
            </ul>
          </nav>
          <button className="hidden sm:block btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">
            Login
          </button>
          <button className="hidden md:block" onClick={toggleTheme}>{dark ? "☀️ Light" : "🌙 Dark"}</button>{" "}
          <div className="md:hidden" ><CiMenuBurger size={28}/></div>
        </div>
      </div>
    </div>
  );
}
