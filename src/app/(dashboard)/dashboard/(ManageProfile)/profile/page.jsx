import ManageProfile from "@/components/ManageProfile/ManageProfile";
import { getCurrentUser } from "@/lib/api";

export default async function Page() {
  const user = await getCurrentUser()
  const userRole =user.role;
  const {password, providers, _id, failedLoginAttempts, lockUntil, ...userData} = user
  console.log(userData)
  return (
    <div className="md:p-8">
      <ManageProfile userData={userData} />
      {/* <ManageProfile role="user" />
      <ManageProfile role="admin" /> */}
      {/* role="rider" বা role="user" ও দিতে পারো */}
    </div>
  );
}
