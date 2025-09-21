"use client";
import React, { useState } from "react";
import Link from "next/link";
import SocialLogin from "./SocialLogin";
import { registerUser } from "@/actions/auth/register";
import { signIn, useSession } from "next-auth/react";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleRegisterForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target);
    const registerData = Object.fromEntries(form.entries());

    try {
      const res = await registerUser(registerData);
      if (res.acknowledged) {
        // login after registration
        const signInAfterRegister = await signIn("credentials", {
          email: registerData.email,
          password: registerData.password,
          redirect: true,
        });

        if (signInAfterRegister.ok) {
          await update();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registration & Login successful",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            router.push("/products"); // redirect AFTER Swal closes
          });
        }
        else {
          Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to login after registration",
        });
        }
      }
      else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Registration failed!",
      });
    }
    } catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  };

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
        <Link
          href={"/login"}
          className="text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          Login
        </Link>
      </span>
    </form>
  );
};

export default RegisterForm;
