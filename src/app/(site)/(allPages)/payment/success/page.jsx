"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const parcelId = searchParams.get("parcelId");
  const [isDownloading, setIsDownloading] = useState(false);


  useEffect(() => {
    if (parcelId) {
      fetch(`/api/payment-success/${parcelId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment success processed:", data);
        })
        .catch((err) => console.error(err));
    }
  }, [parcelId]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(`/api/invoices/${parcelId}`);
      if (!res.ok) throw new Error("Failed to download invoice");

      // Create a blob and trigger download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${parcelId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-2">Your parcel has been booked successfully.</p>

        <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="px-6 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {isDownloading ? "Downloading..." : "Download Invoice"}
      </button>

      <button
        onClick={() => router.push("/user-dashboard/my-bookings")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
      >
        Go to My Bookings
      </button>
    </div>
  );
}
