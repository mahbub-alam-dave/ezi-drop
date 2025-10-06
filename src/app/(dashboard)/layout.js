
import DashboardLayoutClient from "@/components/dashboardComponents/DashboardLayoutClient";
import { getCurrentUser } from "@/lib/api";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { redirect } from "next/navigation";


export default async function DashboardLayout({ children }) {

  // const role = "rider";
  // const role = "admin";

  const user = await getCurrentUser()

/*   if(!user) {
    redirect("/login")
  } */

  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified
  }



  return (
    <NextAuthProvider>
      <DashboardLayoutClient userData={userData}>
        {children}
      </DashboardLayoutClient>
    </NextAuthProvider>
  );
}
