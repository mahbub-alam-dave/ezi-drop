import ManageProfile from '@/components/ManageProfile/ManageProfile';
import { getCurrentUser } from '@/lib/api';
import React from 'react';

const AdminProfile = async() => {
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

export default AdminProfile;