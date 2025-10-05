import ManageProfile from "@/components/ManageProfile/ManageProfile";
import { getCurrentUser } from "@/lib/api";

export default async function Page() {
  const user = await getCurrentUser()
  const {password, providers, _id, failedLoginAttempts, createdAt, updatedAt, lockUntil, ...userData} = user
  return (
    <div className="md:p-8">
      <ManageProfile userData={userData} />
      {/* <ManageProfile role="user" />
      <ManageProfile role="admin" /> */}
      {/* role="rider" বা role="user" ও দিতে পারো */}
    </div>
  );
}
