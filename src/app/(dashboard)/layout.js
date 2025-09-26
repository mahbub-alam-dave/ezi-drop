import NextAuthProvider from "@/providers/NextAuthProvider";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const status = "authenticated";
  const role = "user";
  // const role = "rider";
  // const role = "admin";

  const dashboardLinks = {
    adminLinks: (
      <>
        <Link href="/dashboard/overview">Overview</Link>
        <Link href="/assign-riders">Assign Riders</Link>
        <Link href="/dashboard/manage-candidate">Manage Candidate</Link>
        <Link href="/dashboard/profile">Profile</Link>
      </>
    ),
    riderLinks: (
      <>
        <li>
          <Link href="/dashboard/rider-overview">Rider dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/manage-candidates">Manage Candidates</Link>
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
    <>
      <NextAuthProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
          {/* Sidebar */}
          <aside className="w-1/5 text-color bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] p-6 lg:p-8">
            <Link href={"/"} className="mb-6">
              <h2 className="text-2xl font-bold ">Ezi Drop</h2>
            </Link>

            {status === "authenticated" && role === "admin" ? (
              <ul className="space-y-3 flex flex-col mt-6">
                {dashboardLinks.adminLinks}
              </ul>
            ) : status === "authenticated" && role === "rider" ? (
              <ul className="space-y-3 flex flex-col mt-6">
                {dashboardLinks.riderLinks}
              </ul>
            ) : (
              <ul className="space-y-3 flex flex-col mt-6">
                {dashboardLinks.userLinks}
              </ul>
            )}
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </NextAuthProvider>
    </>
  );
}
