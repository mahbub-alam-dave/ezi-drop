"use client";
import Link from "next/link";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { IoMdClose } from "react-icons/io";
// import NotificationPanel from "@/components/NotificationPanel/NotificationPanel";

const Sidebar = ({ setOpenMenu, toggleTheme, setUnseenNotifCount }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dark, setDark] = useState(false);

  const {data:session, status} = useSession();
  const userId = session?.user?.userId

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut({ redirect: false });
      setShowLogoutModal(false);
      
      // Show custom success modal
      setShowSuccessModal(true);
      
      // Auto close success modal after 1.5 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
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
        <Link onClick={() => setOpenMenu(m => !m)} href={'/'}>Home</Link>
        <Link onClick={() => setOpenMenu(m => !m)} href={"/send-parcel"}>Parcel Booking</Link>
        {
          status === "authenticated" &&
          <Link onClick={() => setOpenMenu(m => !m)} href={"/dashboard"}>Dashboard</Link>
        }
        <Link onClick={() => setOpenMenu(m => !m)} href={"/about"}>About</Link>
        <Link onClick={() => setOpenMenu(m => !m)} href={"/contact"}>Contact</Link>
      </>
    );

  return (
    <>
      <div className="w-[300px] h-screen background-color shadow shadow-gray-200">
        <div className="flex flex-col items-start gap-6 p-8">
          <div onClick={() => setOpenMenu(m => !m)}>
            <IoMdClose className="text-2xl text-color"/>
            </div>
          <nav>
            <ul className="flex flex-col gap-8">{navLinks}</ul>
          </nav>
          <div className="flex sm:hidden gap-4">
            {status === "authenticated" ? (
              <button
                onClick={handleLogout}
                className="btn bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] rounded-sm text-white border-none"
              >
                Log
              </button>
            ) : (
              <Link href={"/login"}>
                <button className="btn bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] rounded-sm text-white border-none">
                  Login
                </button>
              </Link>
            )}
          </div>
              <button className="lg:hidden" onClick={toggleTheme}>
              {dark ? "☀️" : "🌙"}
            </button>

{/*             <div className="lg:hidden">
                        {status === "authenticated" && userId && (
                          <NotificationPanel
                            userId={userId}
                            onUnseenChange={setUnseenNotifCount}
                          />
                        )}
        </div> */}
            
        </div>
      </div>

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
    </>
  );
};

export default Sidebar;