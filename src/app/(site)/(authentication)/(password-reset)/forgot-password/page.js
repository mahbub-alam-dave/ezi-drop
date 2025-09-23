"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // console.log(res)
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
        Swal.fire({
          title: "Success!",
          text: {message},
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
          background: "var(--color-bg)",
          color: "var(--color-text)",
        });
      }
      else {
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  };
  return (
    <div className="max-w-md mx-auto my-16 p-6 rounded-2xl shadow-lg background-color">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="input-style w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full background-color-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "processing" : "Send Reset Link"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default ForgotPassword;
