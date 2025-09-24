import { useState } from "react";

export default function OtpModal({ email, onClose }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      onClose(); // close modal
      // force re-login after verification
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Verify OTP</h2>
        <input
          type="text"
          className="border p-2 w-full mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button
          onClick={verifyOtp}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Verify
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}
