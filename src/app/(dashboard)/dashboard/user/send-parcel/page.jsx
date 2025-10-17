import React from 'react';
import { getCurrentUser } from '@/lib/api';
import { getServerSession } from 'next-auth';
import { districtsData } from '@/lib/getDistrictData';
import { authOptions } from '@/lib/authOptions';
import SendParcel from '@/components/sendparcelPageComponents/SendParcel';

const Page = async () => {

  const session = await getServerSession(authOptions)

  const districtsInfo = await districtsData()
  // console.log(districts)
  const districts = JSON.parse(JSON.stringify(districtsInfo));

  let userData = {}
  if(session?.user) {

    const userInfo = await getCurrentUser();
    userData = ({
      name: userInfo.name, 
      email: userInfo.email, 
      district: userInfo?.district || null, 
      districtId: userInfo?.districtId || null
    }) 
    console.log(userData)
  }
  console.log(session?.user)
  return (
    <div>
      <SendParcel districts={districts} userData={userData}/>
    </div>
  );
};

export default Page;