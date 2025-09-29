import { getCurrentUser } from '@/lib/api';
import { redirect } from 'next/navigation';
import React from 'react';

const Dashboard = async () => {
    const user = await getCurrentUser()

    if(!user) {
        redirect("/login")
    }
    if(user.role === "admin") {
        redirect("/dashboard/overview")
    }
    else if(user.role === "rider") {
        redirect("/dashboard/rider-overview")
    }
    else{
        redirect("/dashboard/user-overview")
    }
    return (
<div>
      <h1 className="text-3xl font-bold text-color">Dashboard Home</h1>
      <p className="mt-4 text-color-soft">Welcome to your dashboard!</p>
    </div>
    );
};

export default Dashboard;