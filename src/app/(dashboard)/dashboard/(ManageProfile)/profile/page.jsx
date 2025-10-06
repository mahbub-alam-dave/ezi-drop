import ManageProfile from "@/components/ManageProfile/ManageProfile";
import { getCurrentUser } from "@/lib/api";

export default async function Page() {
  const user = await getCurrentUser()
  const {password, providers, _id, failedLoginAttempts, updatedAt, lockUntil, ...userData} = user;

  const formattedUserData = {
  ...userData,
  createdAt: new Date(userData.createdAt).toLocaleString(),
};
  return (
    <div className="md:p-8">
      <ManageProfile userData={formattedUserData} />
      {/* <ManageProfile role="user" />
      <ManageProfile role="admin" /> */}
      {/* role="rider" বা role="user" ও দিতে পারো */}
    </div>
  );
}
