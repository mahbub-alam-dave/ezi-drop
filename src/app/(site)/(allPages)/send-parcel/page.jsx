import SendParcel from '@/components/sendparcelPageComponents/SendParcel';
import React from 'react';
import { districtsData } from '../../../../lib/getDistrictData';

const SendParcelPage = async () => {
  const districtsInfo = await districtsData()
  // console.log(districts)
  const districts = JSON.parse(JSON.stringify(districtsInfo));
  return (
    <div>
      <SendParcel districts={districts}/>
    </div>
  );
};

export default SendParcelPage;