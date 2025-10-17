import React from "react";

export default function loading() {
  return (
    <div className="p-10">
    <div className="flex justify-between">
         <div className="space-y-5 mb-10">
       <h1 className="h-10 w-50 bg-gray-300 rounded-2xl animate-pulse"></h1>
       <h1 className="h-10 w-70 bg-gray-300 rounded-2xl animate-pulse"></h1>
      
     </div>
     <div className="flex gap-3">
        <button className="bg-gray-300 rounded-2xl animate-pulse h-10 w-20 "></button>
        <button className="bg-gray-300 rounded-2xl animate-pulse h-10 w-20 "></button>
     </div>
    </div>
      
        <div className="flex gap-10 justify-between">
         <div className="bg-gray-300 rounded-2xl animate-pulse  p-5 h-full w-3/12">
<div className="bg-gray-100 rounded-full mx-auto h-20 w-20 animate-pulse"></div>
<div className="space-y-4 mt-5" >
  <p className="  bg-gray-100 rounded-2xl animate-pulse  mx-auto  h-7 w-30"></p>
<p className="  bg-gray-100 rounded-2xl animate-pulse  mx-auto  h-7 w-30"></p>
<p className="  bg-gray-100 rounded-2xl animate-pulse  mx-auto  h-7 w-30"></p>
<p className="  bg-gray-100 rounded-2xl animate-pulse  mx-auto  h-7 w-30"></p>
</div>
         </div>
         <div className="bg-gray-300 rounded-2xl animate-pulse p-5  h-full p- space-y-5  w-9/12">
<div className="bg-gray-100 rounded-2xl animate-pulse h-30 w-full"></div>
<div className="bg-gray-100 rounded-2xl animate-pulse h-30 w-full"></div>
        </div>   
        </div>
     <div className="flex gap-10 mt-10">
<div className="bg-gray-300 animate-pulse rounded-2xl h-60 w-4/12">

</div>
<div className="flex w-8/12 gap-5">
  <div className="bg-gray-300 animate-pulse rounded-2xl h-60 w-6/12  "></div>
  <div className="bg-gray-300 animate-pulse rounded-2xl h-60 w-6/12 "></div>
</div>
     </div>
    </div>
  );
}
