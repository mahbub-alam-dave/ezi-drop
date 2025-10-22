import ManageProfile from '@/components/ManageProfile/ManageProfile';
import { getCurrentUser } from '@/lib/api';


const UserProfile = async () => {
      const user = await getCurrentUser()
      const {password, providers, _id, failedLoginAttempts, updatedAt, lockUntil, ...userData} = user;
      const formattedUserData = {
      ...userData,
      createdAt: new Date(userData.createdAt).toLocaleString(),
    };
    return (
        <div>
            <ManageProfile userData={formattedUserData} />
        </div>
    );
};

export default UserProfile;