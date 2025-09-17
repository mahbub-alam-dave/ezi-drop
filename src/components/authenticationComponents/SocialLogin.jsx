"use client"
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import Image from 'next/image';



const SocialLogin = () => {

    const handleSocialLogin = () =>{
        
    }

  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <div onClick={() => handleSocialLogin("github")} className="w-[50px] h-[50px] bg-gray-100 rounded-full flex justify-center items-center cursor-pointer">
        <FaGithub size={22} />
      </div>
      <Image
      onClick={() => handleSocialLogin("google")}
      className="w-[50px] h-[50px] cursor-pointer"
        width={50}
        height={50}
        src={"https://i.ibb.co.com/7hVLq5R/Google.png"}
        alt="google"
      />
    </div>
  );
};

export default SocialLogin;
