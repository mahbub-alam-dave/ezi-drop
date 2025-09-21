"use client";
import React, { useState } from "react";
import Link from "next/link";
import SocialLogin from "./SocialLogin";




const RegisterForm = () => {

  const [loading, setLoading]  =  useState(false)

    const handleRegisterForm = async (e) => {
      e.preventDefault();
      setLoading(true);
      const form = new FormData(e.target)
      const registerData = Object.fromEntries(form.entries());
      console.log(registerData)


    }

  return (
    <form onSubmit={handleRegisterForm} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="">
          Name
        </label>
        <input
          type="text"
          name="name"
          className="input-style w-full mt-2"
          placeholder="Enter name"
        />
      </div>
      <div>
        <label htmlFor="email" className="">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="input-style w-full mt-2"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label htmlFor="password" className="">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="input-style w-full mt-2"
          placeholder="Enter password (6 characters)"
        />
      </div>
      <button
        type="submit"
        className="bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] px-6 py-3 cursor-pointer rounded-full mt-4 w-full text-white font-medium text-lg"
      >
        Register
      </button>
      <span className="mt-6 text-center">Or Sign Up with</span>
      <SocialLogin />
      <span className="text-center">
        Already have an account?{" "}
        <Link href={"/login"} className="text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
          Login
        </Link>
      </span>
    </form>
  );
};

export default RegisterForm;
