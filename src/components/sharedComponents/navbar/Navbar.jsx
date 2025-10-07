"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Sidebar from "./Sidebar";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {

  const { data: session, status } = useSession();

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
      <Link href={"/send-parcel"}>Send Parcel</Link>
      {
         status==="authenticated" &&
        <Link href={"/dashboard"}>Dashboard</Link>
      }
      <Link href={"/about"}>About</Link>
      <Link href={"/contact"}>Contact</Link>
     
   
    </>
  );

  return (
    <div className=" w-full flex justify-center h-[100px] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8  fixed z-1000 ">
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold"><Link href={"/"}>Ezi Drop </Link></h1>
        <div className="flex items-center gap-8">
          <nav>
            <ul className="hidden md:flex gap-8 ">
              
              {navLinks}
            </ul>
          </nav>
              <div className='flex gap-4'>
      {
        status === "authenticated" ?
        <button onClick={() => signOut()} className="hidden sm:block btn bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] rounded-sm text-white border-none">Logout</button>
       :
      <Link href={'/login'}><button className="hidden sm:block btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">Login</button></Link>
      }
    </div>
          <button className="hidden md:block" onClick={toggleTheme}>
            {dark ? "☀️" : "🌙"}
          </button>{" "}
          <div className="md:hidden" onClick={handleMenuButton}>
            <CiMenuBurger size={28} />
          </div>
        </div>
      </div>

      {openMenu && (
        <div className="md:hidden absolute right-0 top-[100px] z-1000">
          <Sidebar navLinks={navLinks} status={status} />
        </div>
      )}
    </div>
  );
}
