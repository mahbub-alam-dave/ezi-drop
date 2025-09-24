import { signIn } from "next-auth/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function OtpModal({ signInData, closeModal }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const email = signInData.email;
  const password = signInData.password;

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      // After OTP verified → sign in automatically
      await signIn("credentials", {
        email,
        password, // you should have it in state
        redirect: true,
      });
      onClose();
      closeModal(o => !o)
    } else {
      Swal.fire({ icon: "error", title: "Invalid OTP", text: data.message });
    }
  };

  const resendOtp = async () => {
    await fetch("/api/auth/generate-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="background-color p-6 rounded-xl shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Verify OTP</h2>
        <input
          type="text"
          className="input-style w-full mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <div className="flex gap-2 items-center">
          <button
            onClick={resendOtp}
            className="btn border-color text-color py-2 rounded-md hover:bg-blue-700 transition"
          >
            resend
          </button>
          <button
            onClick={verifyOtp}
            className="btn background-color-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </div>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
