"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const parcelId = searchParams.get("parcelId");

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
  });

  const [parcel, setParcel] = useState(null);

  useEffect(() => {
    if (parcelId) {
      fetch(`/api/parcels/${parcelId}`)
        .then((res) => res.json())
        .then((data) => {
          setParcel(data);
          setFormData({
            amount: data.cost || "",
            customer_name: data.senderName || "",
            customer_email: "",
            customer_phone: data.senderPhone || "",
            customer_address: data.pickupAddress || "",
          });
        })
        .catch((err) => console.error(err));
    }
  }, [parcelId]);

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
      console.log("Payment response:", data);

      if (data && data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        alert("Payment Failed");
      }
    } else {
      alert("Select Payment Method");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-10 background-color">
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
        </select>

        {paymentMethod === "SSLCommerz" && (
          <>
            <label className="block mb-2 text-color-soft">Email</label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
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
