import ManageProfile from '@/components/ManageProfile/ManageProfile';
import { getCurrentUser } from '@/lib/api';
import { districtsData } from '@/lib/getDistrictData';

const RiderProfile = async() => {
      const user = await getCurrentUser()
      const {password, providers, _id, failedLoginAttempts, updatedAt, lockUntil, ...userData} = user;
      const formattedUserData = {
      ...userData,
      createdAt: new Date(userData.createdAt).toLocaleString(),
    };

          const districtsInfo = await districtsData()
          const districts = JSON.parse(JSON.stringify(districtsInfo));
    return (
        <div>
            <ManageProfile allDistricts={districts} userData={formattedUserData} />
        </div>
    );
};

export default RiderProfile;