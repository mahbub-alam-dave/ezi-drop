// ...existing code...
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  FaUserCog,
  FaComments,
  FaUsers,
  FaMotorcycle,
  FaUserTie,
  FaUser,
  FaClipboardList,
  FaTruck,
  FaHistory,
  FaBox,
  FaComment,
  FaUserPlus,
  FaTachometerAlt,
} from "react-icons/fa";
import { VscCommentUnresolved } from "react-icons/vsc";
import ThemeToggle from "../sharedComponents/navbar/Toggle";

const DashboardLayoutClient = ({ userData, children }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session, status } = useSession();

  const linkClass = (path) =>
    `px-6 py-2 rounded-md transition-colors duration-200
     ${
       pathname === path
         ? "bg-[var(--color-primary)] text-white dark:bg-[var(--color-primary-dark)]"
         : "hover:bg-blue-200  dark:hover:bg-blue-300"
     }`;

  // dashboard links for roles — merged so each role has its chat link
  const dashboardLinks = {
    adminLinks: (
      <>
        <Link
          href="/dashboard/overview"
          className={linkClass("/dashboard/overview")}
        >
          <FaTachometerAlt className="inline-block mr-2" />
          Overview
        </Link>
        <Link
          href="/dashboard/manage-users"
          className={linkClass("/dashboard/manage-users")}
        >
          <FaUsers className="inline-block mr-2" />
          Manage Users
        </Link>
        <Link href="/assign-riders" className={linkClass("/assign-riders")}>
          <FaMotorcycle className="inline-block mr-2" />
          Assign Riders
        </Link>
        <Link
          href="/dashboard/manage-candidates"
          className={linkClass("/dashboard/manage-candidates")}
        >
          <FaUserTie className="inline-block mr-2" />
          Manage Candidate
        </Link>
        <Link
          href="/dashboard/profile"
          className={linkClass("/dashboard/profile")}
        >
          <FaUser className="inline-block mr-2" />
          Profile
        </Link>
        <Link
          href="/dashboard/manage-order"
          className={linkClass("/dashboard/manage-order")}
        >
          <FaClipboardList className="inline-block mr-2" />
          Manage Order
        </Link>
        <Link href="/dashboard/chat" className={linkClass("/dashboard/chat")}>
          <FaComment className="inline-block mr-2" />
          Chat
        </Link>
      </>
    ),
    riderLinks: (
      <>
        <Link
          href="/dashboard/rider-overview"
          className={linkClass("/dashboard/rider-overview")}
        >
          <FaTachometerAlt className="inline-block mr-2" />
          Rider Dashboard
        </Link>
        <Link href="/dashboard/order" className={linkClass("/dashboard/order")}>
          <FaTruck className="inline-block mr-2" />
          Order
        </Link>
        <Link
          href="/dashboard/delivery-history"
          className={linkClass("/dashboard/delivery-history")}
        >
          <FaHistory className="inline-block mr-2" />
          Delivery History
        </Link>
        <Link
          href="/dashboard/profile"
          className={linkClass("/dashboard/profile")}
        >
          <FaUser className="inline-block mr-2" />
          Profile
        </Link>
        <Link
          href="/dashboard/riderChat"
          className={linkClass("/dashboard/riderChat")}
        >
          <FaComments className="inline-block mr-2" />
          Chat
        </Link>
      </>
    ),
    userLinks: (
      <>
        <Link
          href="/dashboard/user-overview"
          className={linkClass("/dashboard/user-overview")}
        >
          <FaTachometerAlt className="inline-block mr-2" />
          Overview
        </Link>
        <Link
          href="/dashboard/send-parcel"
          className={linkClass("/dashboard/send-parcel")}
        >
          <FaBox className="inline-block mr-2" />
          Send Parcel
        </Link>
        <Link
          href="/dashboard/orders-history"
          className={linkClass("/dashboard/orders-history")}
        >
          <FaClipboardList className="inline-block mr-2" />
          Orders History
        </Link>
        <Link
          href="/dashboard/profile"
          className={linkClass("/dashboard/profile")}
        >
          <FaUser className="inline-block mr-2" />
          Profile
        </Link>
          <Link
          href="/dashboard/resulation-center"
          className={linkClass("/dashboard/resulation-center")}
        >
          <VscCommentUnresolved className="inline-block mr-2" />
          Resulation Center
        </Link>
        <Link
          href="/dashboard/be-a-rider"
          className={linkClass("/dashboard/be-a-rider")}
        >
          <FaUserPlus className="inline-block mr-2" />
          Be A Rider
        </Link>
        <Link
          href="/dashboard/userChat"
          className={linkClass("/dashboard/userChat")}
        >
          <FaComments className="inline-block mr-2" />
          Chat
        </Link>
      </>
    ),
    districtAgentLinks: (
      <>
        <Link
          href="/dashboard/district-agent/overview"
          className={linkClass("/dashboard/district-agent/overview")}
        >
          <FaTachometerAlt className="inline-block mr-2" />
          Overview
        </Link>
        <Link
          href="/dashboard/district-agent/check-wire-houses"
          className={linkClass("/dashboard/district-agent/check-wire-houses")}
        >
          <FaClipboardList className="inline-block mr-2" />
          Check Wire-houses
        </Link>
        <Link
          href="/dashboard/district-agent/profile"
          className={linkClass("/dashboard/district-agent/profile")}
        >
          <FaUser className="inline-block mr-2" />
          Profile
        </Link>
        <Link
          href="/dashboard/district-agent/resulation-center"
          className={linkClass("/dashboard/district-agent/resulation-center")}
        >
          <VscCommentUnresolved className="inline-block mr-2" />
          Resulation Center
        </Link>
      </>
    )
  };

  const renderLinks =
    (status === "authenticated" && userData.role === "admin")
      ? dashboardLinks.adminLinks
      : status === "authenticated" && userData.role === "rider"
      ? dashboardLinks.riderLinks
      : status === "authenticated" && userData.role === "support_agent" 
      ? dashboardLinks.districtAgentLinks
      : dashboardLinks.userLinks;

  return (
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
      <aside
        className="hidden lg:block fixed top-0 left-0 z-50 w-[350px]
                          bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
                          p-6 lg:p-8 h-screen shadow-md"
      >
        <Link href="/" className="mb-6 block">
          <h2 className="text-2xl font-bold text-color">Ezi Drop</h2>
        </Link>
        <nav className="space-y-3 flex flex-col mt-6">{renderLinks}</nav>
        <div className="px-6 mt-4">
          <ThemeToggle />
        </div>
      </aside>

      {/* ---- Main content ---- */}
      <main className="pt-[72px] lg:pt-0 lg:ml-[350px] p-6  min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayoutClient;
// ...existing code...