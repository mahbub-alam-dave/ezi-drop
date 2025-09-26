"use client";
import { useState } from "react";

export default function Checkout() {
  const [method, setMethod] = useState(""); 
  const [form, setForm] = useState({
    amount: "",
    cus_name: "",
    cus_email: "",
    cus_phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // send the request to SSLCommerz 
    const res = await fetch("/api/payment/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirect to SSLCommerz 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>

      <select
        className="border p-2 rounded mb-6"
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="">-- Select --</option>
        <option value="stripe">Stripe</option>
        <option value="sslcommerz">SSLCommerz</option>
      </select>

      {method === "sslcommerz" && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] shadow-lg p-6 rounded"
        >
          <h3 className="text-xl font-semibold mb-4">SSLCommerz Checkout</h3>

          <input
            name="amount"
            placeholder="Amount"
            onChange={handleChange}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <input
            name="cus_name"
            placeholder="Full Name"
            onChange={handleChange}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <input
            name="cus_email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <input
            name="cus_phone"
            placeholder="Phone"
            onChange={handleChange}
            className="border p-2 mb-3 w-full rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-white py-2 rounded"
          >
            Get Ready To Payment
          </button>
        </form>
      )}
    </div>
  );
}
