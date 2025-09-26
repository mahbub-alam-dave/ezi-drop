"use client";
import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === "SSLCommerz") {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data && data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        alert("Payment Failed");
      }
    } else if (paymentMethod === "Stripe") {
      alert("Stripe payment integration is not added");
    } else {
      alert("Select Payment Method");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen background-color">
      <form
        onSubmit={handlePayment}
        className="background-color p-6 rounded-lg shadow-md w-full max-w-md border border-[var(--color-border)]"
      >
        <h2 className="text-2xl font-bold mb-4 text-color">Payment Form</h2>

        <label className="block mb-2 text-color-soft">Select Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="input-style mb-4 w-full"
          required
        >
          <option value="">--Select--</option>
          <option value="SSLCommerz">SSLCommerz</option>
          {/* <option value="Stripe">Stripe</option> */}
        </select>

        {paymentMethod === "SSLCommerz" && (
          <>
            <label className="block mb-2 text-color-soft">Name</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="input-style mb-4 w-full"
              required
            />

            <label className="block mb-2 text-color-soft">Email</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className="input-style mb-4 w-full"
              required
            />

            <label className="block mb-2 text-color-soft">Phone</label>
            <input
              type="text"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              className="input-style mb-4 w-full"
              required
            />

            <label className="block mb-2 text-color-soft">Address</label>
            <input
              type="text"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              className="input-style mb-4 w-full"
            />

            <label className="block mb-2 text-color-soft">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-style mb-4 w-full"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="background-color-primary text-white px-6 py-2 rounded w-full"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : paymentMethod
            ? `Pay with ${paymentMethod}`
            : "Pay"}
        </button>
      </form>
    </div>
  );
}
