"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ResetPassword = ({params}) => {
    // const router = useRouter();
  const { token } = React.use(params);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    alert(data.message);
  };
    return (
          <div className="max-w-md mx-auto my-16 p-6 rounded-2xl shadow-lg background-color">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-style w-full"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        className="input-style w-full"
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button 
      type="submit"
      className="w-full background-color-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
      >Reset Password
      </button>
    </form>
    </div>
    );
};

export default ResetPassword;