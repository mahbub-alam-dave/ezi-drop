"use client"
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";



const SocialLogin = () => {

  const session = useSession();
  const router = useRouter()

    const handleSocialLogin = (providerName) =>{
        console.log("social login", providerName)
        signIn(providerName, {callbackUrl: "/"})
    }

    useEffect(() => {
      if(session.status === "authenticated") {
        router.push("/")
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Logged In successfully",
            showConfirmButton: false,
            timer: 1500,
          })
      }
    },[session.status])

  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <div onClick={() => handleSocialLogin("github")} className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer">
        <FaGithub size={22} />
      </div>
      <div onClick={() => handleSocialLogin("google")} className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer ">
        <FcGoogle size={22} />
      </div>
{/*       <Image
      onClick={() => handleSocialLogin("google")}
      className="w-[50px] h-[50px] cursor-pointer dark:grayscale-100"
        width={50}
        height={50}
        src={"https://i.ibb.co.com/7hVLq5R/Google.png"}
        alt="google"
      /> */}
    </div>
  );
};

export default SocialLogin;
