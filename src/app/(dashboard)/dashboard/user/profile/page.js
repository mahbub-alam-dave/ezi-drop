import ManageProfile from '@/components/ManageProfile/ManageProfile';
import { getCurrentUser } from '@/lib/api';
import { districtsData } from '@/lib/getDistrictData';



const UserProfile = async () => {
    
      const districtsInfo = await districtsData()
      const districts = JSON.parse(JSON.stringify(districtsInfo));

      const user = await getCurrentUser()
      const {password, providers, _id, failedLoginAttempts, updatedAt, lockUntil, ...userData} = user;
      const formattedUserData = {
      ...userData,
      createdAt: new Date(userData.createdAt).toLocaleString(),
    };

    
    return (
        <div>
            <ManageProfile allDistricts={districts} userData={formattedUserData} />
        </div>
    );
};

export default UserProfile;