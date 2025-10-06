"use client";
import React, { useState } from "react";
import Link from "next/link";
import SocialLogin from "./SocialLogin";
import { signIn, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import OtpModal from "../modals/OtpModal";


const LoginForm = () => {
  const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [otpModalData, setOtpModalData] = useState({})
    const [error, setError] =useState("")

  const router = useRouter()
  const { update } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
    // ✅ Step 1: Check if user exists and verified
    const res = await fetch(`/api/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      Swal.fire({ icon: "error", title: "Oops...", text: data.message });
      return;
    }

    if (!data.emailVerified) {
      // ✅ Step 2: Generate OTP and show modal
      await fetch("/api/auth/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setOtpModalData({ email, password });
      setShowOtpModal(true);
      return;
    }

    // ✅ Step 3: If verified, sign in normally
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response.error) {
  setError(response.error); // Will show "Account locked. Try again later."
}

    if (response?.ok) {
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged In successfully",
        showConfirmButton: false,
        timer: 1500,
      }).then(() =>  {
        router.push("/");
        form.reset();
        update()
      });
    } else {
      Swal.fire({ icon: "error", title: "Oops...", text: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div>
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
  
      <p className="text-red-600">{error}</p>

      <button
        type="submit"
        className="bg-[var(--color-secondary)] dark:bg-[var(--color-secondary-dark)] px-6 py-3 cursor-pointer rounded-full mt-4 w-full text-white font-medium text-lg"
      >
        {loading ? "loading..." : "Login"}
      </button>
      <span className="mt-6 text-center">Or Sign Up with</span>
      <SocialLogin />
      <span className="text-center">
        Don't have an account?{" "}
        <Link
          href={"/register"}
          className="text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
        >
          register
        </Link>
      </span>
    </form>
    {showOtpModal &&
    <OtpModal signInData={otpModalData} closeModal={setShowOtpModal} />
    }
    </div>
  );
};

export default LoginForm;
