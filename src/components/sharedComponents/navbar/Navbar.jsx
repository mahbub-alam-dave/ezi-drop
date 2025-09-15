"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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

  const handleMenuButton = () => {
    setOpenMenu((o) => !o);
  };

  const navLinks = (
    <>
      <Link href={'/'}>Home</Link>
      <Link href={"send-parcel"}>Send Parcel</Link>
      <Link href={"dashboard"}>Dashboard</Link>
      <Link href={"about"}>About</Link>
    </>
  );

  return (
    <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8 relative">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center h-[100px]">
        <h1 className="text-2xl font-bold">Ezi Drop </h1>
        <div className="flex items-center gap-8">
          <nav>
            <ul className="md:flex gap-8 hidden">
              {navLinks}
            </ul>
          </nav>
          <button className="hidden sm:block btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">
            Login
          </button>
          <button className="hidden md:block" onClick={toggleTheme}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>{" "}
          <div className="md:hidden" onClick={handleMenuButton}>
            <CiMenuBurger size={28} />
          </div>
        </div>
      </div>
      {openMenu && (
        <div className="md:hidden absolute right-0 top-[100px]">
          <Sidebar navLinks={navLinks} />
        </div>
      )}
    </div>
  );
}
