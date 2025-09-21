
import NextAuthProvider from "@/providers/NextAuthProvider";
import Link from "next/link";


export default function DashboardLayout({ children }) {
  return (
    <>
      <NextAuthProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-black">
          {/* Sidebar */}
          <aside className="w-[450px] text-color bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] p-6 lg:p-8">
            <Link href={'/'} className="mb-6"><h2 className="text-2xl font-bold ">Ezi Drop</h2></Link>
            <ul className="space-y-3 mt-6">
              <li><Link href="/dashboard">Overview</Link></li>
              <li><Link href="/manage-orders">Manage orders</Link></li>
              <li><Link href="/dashboard/manage-candidate">Manage candidate</Link></li>
              <li><Link href="/dashboard/profile">Profile</Link></li>
            </ul>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </NextAuthProvider>
    </>
  );
}
