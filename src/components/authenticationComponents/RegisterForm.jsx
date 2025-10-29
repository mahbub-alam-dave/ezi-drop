"use client";
import React, { useState } from "react";
import Link from "next/link";
import SocialLogin from "./SocialLogin";
import { registerUser } from "@/app/actions/auth/register";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import OtpModal from "../modals/OtpModal";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpModalData, setOtpModalData] = useState({});
  const { update } = useSession();

  const handleRegisterForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target);
    const registerData = Object.fromEntries(form.entries());

    try {
      const res = await registerUser(registerData);

/*       if (res.insertedId) {
        //  Step 1: referral check before OTP generation
        try {
          const referralRes = await fetch("/api/referralCheck", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: registerData.email }),
          });

          const referralData = await referralRes.json();

          if (referralData.referred) {
            await Swal.fire({
              position: "center",
              icon: "success",
              title: "You are a referred user!",
              showConfirmButton: true,
            });
          } else {
            await Swal.fire({
              position: "center",
              icon: "success",
              title: "Registration successful!",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.error("Referral check error during registration:", error);
        }

        //  Step 2: generate OTP as before
        await fetch("/api/auth/generate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerData.email }),
        });

        setOtpModalData({
          email: registerData.email,
          password: registerData.password,
        });

        setShowOtpModal(true); // open modal
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Registration failed!",
        });
      } */
    console.log(res)
        if (res.insertedId) {
      await Swal.fire({
        position: "center",
        icon: "success",
        title: res.message || "Registration successful!",
        showConfirmButton: true,
      });

      // Now proceed to OTP or login
      // await sendOtp(registerData.email); or router.push("/login");
      // /  Step 2: generate OTP as before
        await fetch("/api/auth/generate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: registerData.email }),
        });

        setOtpModalData({
          email: registerData.email,
          password: registerData.password,
        });

        setShowOtpModal(true); // open modal
    } else {
      await Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: data.message || "Something went wrong. Please try again.",
      });
    }
    
      } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Creating your account...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Please wait while we register your account
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleRegisterForm} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="input-style w-full mt-2"
            placeholder="Enter name"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="input-style w-full mt-2"
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="input-style w-full mt-2"
            placeholder="Enter password (6 characters)"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 cursor-pointer rounded-full mt-4 w-full font-medium text-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-gray-100 hover:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary)]"
          }`}
        >
          {loading ? "loading..." : "Register"}
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

      {showOtpModal && (
        <OtpModal signInData={otpModalData} closeModal={setShowOtpModal} />
      )}
    </div>
  );
};

export default RegisterForm;
