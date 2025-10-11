import ManageProfile from "@/components/ManageProfile/ManageProfile";
import { getCurrentUser } from "@/lib/api";
import { districtsData } from "@/lib/getDistrictData";

export default async function Page() {
  const user = await getCurrentUser()
  const {password, providers, _id, failedLoginAttempts, updatedAt, lockUntil, ...userData} = user;

  const formattedUserData = {
  ...userData,
  createdAt: new Date(userData.createdAt).toLocaleString(),
};

  const districtsInfo = await districtsData()
  // console.log(districts)
  const districts = JSON.parse(JSON.stringify(districtsInfo));
  // console.log(districts)

  return (
    <div className="md:p-8">
      <ManageProfile userData={formattedUserData} allDistricts={districts} />
      {/* <ManageProfile role="user" />
      <ManageProfile role="admin" /> */}
      {/* role="rider" বা role="user" ও দিতে পারো */}
    </div>
  );
}
