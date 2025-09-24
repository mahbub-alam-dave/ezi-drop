import { signIn } from "next-auth/react";
import { useState } from "react";

export default function OtpModal({ email, password, onClose }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const verifyOtp = async () => {
  const res = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  setMessage(data.message)

  if (res.ok) {
    // After OTP verified → sign in automatically
    await signIn("credentials", {
      email,
      password, // you should have it in state
      redirect: true,
    });
    onClose()
  } else {
    Swal.fire({ icon: "error", title: "Invalid OTP", text: data.message });
  }
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
        <button
          onClick={verifyOtp}
          className="w-full background-color-primary text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Verify
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
