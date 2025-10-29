"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Sidebar from "./Sidebar";
import { signOut, useSession } from "next-auth/react";
// import NotificationPanel from "@/components/NotificationPanel/NotificationPanel";
import { usePathname, useRouter } from "next/navigation";
import NotificationPanel from "@/components/NotificationPanel/NotificationPanel";

export default function Navbar() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.userId || session?.user?._id;
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [unseenNotifCount, setUnseenNotifCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname  = usePathname()

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut({ redirect: false });
      setShowLogoutModal(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/");
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navLinks = (
    <>
      <Link href={"/"} className="nav-link group relative px-4 py-2 ">
        <span className="relative z-10">Home</span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </Link>
      <Link href={"/send-parcel"} className="nav-link group relative px-4 py-2 ">
        <span className="relative z-10">Parcel Booking</span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </Link>
      {status === "authenticated" && (
        <Link href={"/dashboard"} className="nav-link group relative px-4 py-2 ">
          <span className="relative z-10">Dashboard</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </Link>
      )}
      <Link href={"/about"} className="nav-link group relative px-4 py-2 ">
        <span className="relative z-10">About</span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </Link>
      <Link href={"/contact"} className="nav-link group relative px-4 py-2 ">
        <span className="relative z-10">Contact</span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </Link>
    </>
  );

    const links = [
    { href: "/", label: "Home" },
    { href: "/send-parcel", label: "Parcel Booking" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

    if (status === "authenticated") {
    links.splice(2, 0, { href: "/dashboard", label: "Dashboard" }); // insert before About
  }

  return (
    <>
    <div className="relative">
      <div
        className={`w-full flex justify-center h-[100px] fixed z-[1000] transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
            : "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]"
        } px-6 md:px-8`}
      >
        <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center">
          {/* Logo with animated gradient */}
          <Link href={"/"}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
              Ezi Drop
            </h1>
          </Link>

          <div className="flex items-center gap-8">
            {/* Desktop Navigation with hover effects */}
            <nav className="hidden lg:block">
              {/* <ul className="hidden lg:flex gap-6 items-center">{navLinks}</ul> */}
              {links.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`nav-link group relative px-3 py-2 lg:mr-2 rounded-lg transition-all duration-300 ${
              isActive
                ? "text-blue-600 dark:text-purple-400 font-semibold"
                : "text-gray-800 dark:text-gray-200 hover:text-blue-500"
            }`}
          >
            <span className="relative z-10">{label}</span>
            <span
              className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 opacity-15"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10"
              }`}
            ></span>
          </Link>
        );
      })}
            </nav>

            {/* Action Buttons */}
            <div className="flex gap-3 items-center">
              {/* Theme Toggle with smooth animation */}
              <button
                className="hidden lg:flex relative w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-xl group overflow-hidden"
                onClick={toggleTheme}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="text-2xl relative z-10 transform group-hover:rotate-180 transition-transform duration-500">
                  {dark ? "☀️" : "🌙"}
                </span>
              </button>

              {/* Login/Logout Buttons */}
              {status === "authenticated" ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 border border-red-200 dark:border-red-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <Link href={"/login"}>
                  <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 border-none group">
                    <span className="group-hover:translate-x-[-2px] transition-transform duration-300">
                      Login
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </Link>
              )}


              {/* Mobile Menu Button with animation */}
              <button
                className="flex lg:hidden relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-xl items-center justify-center group"
                onClick={handleMenuButton}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <CiMenuBurger
                  size={24}
                  className={`relative z-10 transition-transform duration-300 ${
                    openMenu ? "rotate-90" : ""
                  }`}
                />
              </button>
                            {/* Notification Panel */}
              <div className="  2xl:hidden ">
                {status === "authenticated" && currentUserId && (
                  <NotificationPanel
                    userId={currentUserId}
                    onUnseenChange={setUnseenNotifCount}
                  />
                )}
              </div>
            </div>
            
          </div>

          {/* Desktop Notification (right positioned) */}
          <div className="hidden 2xl:flex justify-center items-center absolute right-6">
            {status === "authenticated" && currentUserId && (
              <NotificationPanel
                userId={currentUserId}
                onUnseenChange={setUnseenNotifCount}
              />
            )}
          </div>
        </div>

        {/* Mobile Sidebar */}
        {openMenu && (
          <div className="lg:hidden absolute right-0 z-[9999]">
            <Sidebar
              setUnseenNotifCount={setUnseenNotifCount}
              setOpenMenu={setOpenMenu}
              toggleTheme={toggleTheme}
            />
          </div>
        )}


      </div>

      <style jsx>{`
        .nav-link {
          @apply px-4 py-2 font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
            {/* Logout Confirmation Modal with enhanced design */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-[90%] mx-4 transform animate-scaleIn">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 rounded-full flex items-center justify-center animate-bounce">
                  <svg
                    className="w-10 h-10 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
                  Confirm Logout
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-base">
                  Are you sure you want to logout from your account?
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={cancelLogout}
                    className="px-8 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 font-semibold hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-500/50"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal with celebration animation */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-[90%] mx-4 transform animate-scaleIn">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full flex items-center justify-center animate-bounce">
                  <svg
                    className="w-10 h-10 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text">
                  Logout Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">
                  You have been logged out successfully.
                </p>
              </div>
            </div>
          </div>
        )}
    </>
  );
}