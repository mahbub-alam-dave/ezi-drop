
import DashboardLayoutClient from "@/components/dashboardComponents/DashboardLayoutClient";
import { getCurrentUser } from "@/lib/api";
import NextAuthProvider from "@/providers/NextAuthProvider";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function DashboardLayout({ children }) {

  // const role = "rider";
  const role = "admin";

  const dashboardLinks = {
    adminLinks: (
      <>
        <Link href="/dashboard/overview">Overview</Link>
        <Link href="/dashboard/manage-users">Manage Rider</Link>
        <Link href="/assign-riders">Assign Riders</Link>
        <Link href="/dashboard/manage-candidates">Manage Candidate</Link>
        <Link href="/dashboard/profile">Profile</Link>
      </>
    ),
    riderLinks: (
      <>
        <li>
          <Link href="/dashboard/rider-overview">Rider dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/manage-candidate">Manage Candidate</Link>
        </li>
        <li>
          <Link href="/dashboard/manage-orders">Manage Orders</Link>
        </li>
        <li>
          <Link href="/dashboard/delivery-history">Delivery History</Link>
        </li>
        <li>
          <Link href="/dashboard/profile">Profile</Link>
        </li>
      </>
    ),
    userLinks: (
      <>
        <li>
          <Link href="/dashboard/useroverview">Overview</Link>
        </li>
        <li>
          <Link href="/dashboard/send-parcel">Send Parcel</Link>
        </li>
        <li>
          <Link href="/dashboard/send-parcel">Orders history</Link>
        </li>
        <li>
          <Link href="/dashboard/profile">Profile</Link>
        </li>
        <li>
          <Link href="/dashboard/be-a-rider">Be A Rider</Link>
        </li>
      </>
    ),
  };

  return (
    <NextAuthProvider>
      <DashboardLayoutClient userData={userData}>
        {children}
      </DashboardLayoutClient>
    </NextAuthProvider>
  );
}
