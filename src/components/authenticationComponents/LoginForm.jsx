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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpModalData, setOtpModalData] = useState({});
  const [error, setError] = useState("");

  const router = useRouter();
  const { update } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      // Step 1: Check if user exists and verified
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
        await fetch("/api/auth/generate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        setOtpModalData({ email, password });
        setShowOtpModal(true);
        return;
      }

      // Step 2: Sign in
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response.error) {
        setError(response.error);
      }

      if (response?.ok) {
        await update(); // refresh session
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logged In successfully",
          showConfirmButton: false,
          timer: 800,
        }).then(() => {
          window.location.href = "/";
          form.reset();
        });
      } else {
        Swal.fire({ icon: "error", title: "Oops...", text: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //   const form = e.target;
  //   const email = form.email.value;
  //   const password = form.password.value;

  //   try {
  //     // ✅ Step 1: Check if user exists and verified
  //     const res = await fetch(`/api/check-user`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       Swal.fire({ icon: "error", title: "Oops...", text: data.message });
  //       return;
  //     }

  //     if (!data.emailVerified) {
  //       // ✅ Step 2: Generate OTP and show modal
  //       await fetch("/api/auth/generate-otp", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email }),
  //       });

  //       setOtpModalData({ email, password });
  //       setShowOtpModal(true);
  //       return;
  //     }

  //     // ✅ Step 3: If verified, sign in normally
  //     const response = await signIn("credentials", {
  //       email,
  //       password,
  //       redirect: false,
  //     });

  //     if (response.error) {
  //       setError(response.error); // Will show "Account locked. Try again later."
  //     }

  //     if (response?.ok) {
  //       await update()
  //       Swal.fire({
  //         position: "center",
  //         icon: "success",
  //         title: "Logged In successfully",
  //         showConfirmButton: false,
  //         timer: 800,
  //       }).then(() => {
  //       window.location.href = "/";
  //       form.reset();
  //       });

  //     } else {
  //       Swal.fire({ icon: "error", title: "Oops...", text: "Invalid credentials" });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({ icon: "error", title: "Oops...", text: "Something went wrong" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      {/* ✅ Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Logging you in...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Please wait while we authenticate your account
            </p>
          </div>
        </div>
      )}

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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <p className="text-red-600">{error}</p>

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 cursor-pointer rounded-full mt-4 w-full font-medium text-lg ${loading
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-gray-100 hover:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary)]"
            }`}
        >
          Login
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

      {showOtpModal && (
        <OtpModal signInData={otpModalData} closeModal={setShowOtpModal} />
      )}
    </div>
  );
};

export default LoginForm;