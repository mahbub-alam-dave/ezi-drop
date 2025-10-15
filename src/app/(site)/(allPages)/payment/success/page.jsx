"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const parcelId = searchParams.get("parcelId");

  const [invoiceUrl, setInvoiceUrl] = useState(null);

  useEffect(() => {
    if (parcelId) {
      fetch(`/api/payment-success/${parcelId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment success processed:", data);
          if (data.invoiceUrl) setInvoiceUrl(data.invoiceUrl);
        })
        .catch((err) => console.error(err));
    }
  }, [parcelId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-2">Your parcel has been booked successfully.</p>

      {invoiceUrl && (
        <a
          href={invoiceUrl}
          target="_blank"
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded"
        >
          Download Invoice
        </a>
      )}

      <button
        onClick={() => router.push("/user-dashboard/my-bookings")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
      >
        Go to My Bookings
      </button>
    </div>
  );
}
