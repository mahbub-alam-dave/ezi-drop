"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Sidebar from "./Sidebar";
import { signOut, useSession } from "next-auth/react";
import NotificationPanel from "@/components/NotificationPanel/NotificationPanel";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();

  const currentUserId = session?.user?.userId || session?.user?._id;
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [unseenNotifCount, setUnseenNotifCount] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut({ redirect: false });
      setShowLogoutModal(false);
      
      // Show custom success modal
      setShowSuccessModal(true);
      
      // Auto close success modal after 2 seconds and refresh the page
      setTimeout(() => {
        setShowSuccessModal(false);
        // Redirect to home page - this will naturally refresh the state
        router.push('/');
        // Force a clean state by redirecting
        router.refresh(); 
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navLinks = (
    <>
      <Link href={'/'}>Home</Link>
      <Link href={"/send-parcel"}>Parcel Booking</Link>
      {
        status === "authenticated" &&
        <Link href={"/dashboard"}>Dashboard</Link>
      }
      <Link href={"/about"}>About</Link>
      <Link href={"/contact"}>Contact</Link>
    </>
  );

  return (
    // Navbar Z-index: z-[1000]
    <div className=" w-full flex justify-center h-[100px] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] px-6 md:px-8  fixed z-[1000] ">
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href={"/"}>Ezi Drop </Link>
        </h1>
        <div className="flex items-center gap-8">
          <nav>
            <ul className="hidden md:flex gap-8 ">{navLinks}</ul>
          </nav>

          {/* Login/Logout */}
          <div className="flex gap-4">
            {status === "authenticated" ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block btn bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] rounded-sm text-white border-none"
              >
                Logout
              </button>
            ) : (
              <Link href={"/login"}>
                <button className="hidden sm:block btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Notification */}
          <div className="flex gap-4 items-center z-[1001]">
            {/* 1. Notification Panel */}
            {status === "authenticated" && currentUserId && (
              <NotificationPanel
                userId={currentUserId}
                onUnseenChange={setUnseenNotifCount}
              />
            )}

            {/* 2. Theme Toggle */}
            <button className="hidden md:block" onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>

            {/* 3. Menu Burger (Mobile) */}
            <div className="md:hidden" onClick={handleMenuButton}>
              <CiMenuBurger size={28} />
            </div>
          </div>
        </div>
      </div>

      {openMenu && (
        // Mobile Menu Z-index: z-[999]
        <div className="md:hidden absolute right-0 top-[100px] z-[999]">
          <Sidebar navLinks={navLinks} status={status} />
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-[90%] mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelLogout}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-[90%] mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Logout Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You have been logged out successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}