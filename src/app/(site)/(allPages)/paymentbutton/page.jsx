"use client";
import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // Stripe or SSLCommerz
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
      alert("Stripe payment integration is not added ");
      //here add strip
    } else {
      alert(" select  Payment Method ");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handlePayment}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Payment Form</h2>

        {/* Payment Method Select */}
        <label className="block mb-2">Select Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 mb-4 w-full"
          required
        >
          <option value="">--Select--</option>
          <option value="SSLCommerz">SSLCommerz</option>
          <option value="Stripe">Stripe</option>
        </select>

        {/* SSLCommerz Form */}
        {paymentMethod === "SSLCommerz" && (
          <>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            />

            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            />

            <label className="block mb-2">Phone</label>
            <input
              type="text"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            />

            <label className="block mb-2">Address</label>
            <input
              type="text"
              name="customer_address"
              value={formData.customer_address}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
            />

            <label className="block mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
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
