"use client";

import NextAuthProvider from "@/providers/NextAuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const status = "authenticated";
  // const role = "user";
  const role = "rider";
  // const role = "admin";

  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path) =>
    `px-4 py-2 rounded-md transition-colors duration-200
     ${
       pathname === path
         ? "bg-[var(--color-primary)] text-white dark:bg-[var(--color-primary-dark)]"
         : "hover:bg-[var(--color-primary)] hover:text-white dark:hover:bg-[var(--color-primary-dark)]"
     }`;

  const dashboardLinks = {
    adminLinks: (
      <>
        <Link href="/dashboard/overview">Overview</Link>
        <Link href="/dashboard/manage-users">Manage Rider</Link>
        <Link href="/assign-riders">Assign Riders</Link>
        <Link href="/dashboard/manage-candidates">Manage Candidate</Link>
        <Link href="/dashboard/profile">Profile</Link>
        <Link href="/dashboard/manage-order">Manage Order</Link>
      </>
    ),
    riderLinks: (
      <>
        <Link href="/dashboard/rider-overview" className={linkClass("/dashboard/rider-overview")}>Rider dashboard</Link>
        <Link href="/dashboard/manage-orders" className={linkClass("/dashboard/manage-orders")}>Manage Orders</Link>
        <Link href="/dashboard/delivery-history" className={linkClass("/dashboard/delivery-history")}>Delivery History</Link>
        <Link href="/dashboard/profile" className={linkClass("/dashboard/profile")}>Profile</Link>
      </>
    ),
    userLinks: (
      <>
        <Link href="/dashboard/useroverview" className={linkClass("/dashboard/useroverview")}>Overview</Link>
        <Link href="/dashboard/send-parcel" className={linkClass("/dashboard/send-parcel")}>Send Parcel</Link>
        <Link href="/dashboard/send-parcel" className={linkClass("/dashboard/send-parcel")}>Orders history</Link>
        <Link href="/dashboard/profile" className={linkClass("/dashboard/profile")}>Profile</Link>
        <Link href="/dashboard/be-a-rider" className={linkClass("/dashboard/be-a-rider")}>Be A Rider</Link>
      </>
    ),
  };

  const renderLinks =
    status === "authenticated" && role === "admin"
      ? dashboardLinks.adminLinks
      : status === "authenticated" && role === "rider"
      ? dashboardLinks.riderLinks
      : dashboardLinks.userLinks;

  return (
    <NextAuthProvider>
      <div className="bg-gray-50 dark:bg-black">
        {/* ---- Topbar / Mobile Nav ---- */}
        <header className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] shadow-md">
          <div className="flex justify-between items-center p-4">
            <Link href="/" className="text-2xl font-bold text-color">
              Ezi Drop
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-color focus:outline-none"
            >
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>

          {/* mobile menu horizontal */}
          {menuOpen && (
            <nav className="flex flex-col relative gap-2 px-4 pb-4">
              {renderLinks}
            </nav>
          )}
        </header>

        {/* ---- Sidebar for large screen ---- */}
        <aside className="hidden lg:block fixed top-0 left-0 z-50 w-64
                          bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
                          p-6 lg:p-8 h-screen shadow-md">
          <Link href="/" className="mb-6 block">
            <h2 className="text-2xl font-bold text-color">Ezi Drop</h2>
          </Link>
          <nav className="space-y-3 flex flex-col mt-6">{renderLinks}</nav>
        </aside>

        {/* ---- Main content ---- */}
        <main
          className="pt-[72px] lg:pt-0 lg:ml-64 p-4 lg:p-8 min-h-screen"
        >
          {children}
        </main>
      </div>
    </NextAuthProvider>
  );
}
