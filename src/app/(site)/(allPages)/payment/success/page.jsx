"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const parcelId = searchParams.get("parcelId");

useEffect(() => {
    if (parcelId) {
      fetch(`/api/payment-success/${parcelId}`)
        .then(res => res.json())
        .then(data => console.log("Payment updated:", data))
        .catch(err => console.error(err));
    } else {
      console.error("No parcelId found in success URL");
    }
  }, [parcelId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful</h1>
      <p className="mt-2">Thank you for your payment!</p>
      <button
        onClick={() => router.push("/user-dashboard/my-bookings")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
      >
        Go to Bookings
      </button>
    </div>
  );
}

//  this is the payment success page, when a parcel is booked with payment confirmed, this payment 
