"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const parcelId = searchParams.get("parcelId"); // parcelId  from url 
  const router = useRouter();

/*   useEffect(() => {
    if (parcelId) {
      fetch(`/api/updatePayment/${parcelId}`, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => console.error(err));
    }
  }, [parcelId]); */

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
