
import { getCurrentUser } from '@/lib/api';
import { getServerSession } from 'next-auth';
import { districtsData } from '@/lib/getDistrictData';
import { authOptions } from '@/lib/authOptions';
import SendParcel from '@/components/sendparcelPageComponents/SendParcel';

export const dynamic = "force-dynamic";

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
      points: userInfo?.points || 0,
      // district: userInfo?.district || null, 
      // districtId: userInfo?.districtId || null,
    }) 
    console.log(userData)
  }
  console.log(userInfo)
  return (
    <div>
      <SendParcel districts={districts}/>
    </div>
  );
};

export default Page;