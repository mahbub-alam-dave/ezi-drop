"use client";
import { useEffect, useState } from "react";

export default function BookingHistory() {
  const [sslBookings, setSslBookings] = useState([]);
  const [stripeBookings, setStripeBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/user-payments");
        const data = await res.json();

        const ssl = data.payments.filter(p => p.payment_gateway === "sslcommerz");
        const stripe = data.payments.filter(p => p.payment_gateway === "stripe");

        setSslBookings(ssl);
        setStripeBookings(stripe);
      } catch (err) {
        console.error("Failed to fetch booking history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-blue-500 text-lg font-semibold animate-pulse">
          Loading your bookings...
        </p>
      </div>
    );

  const Table = ({ title, data, color }) => (
    <div className="mt-10">
      <h2
        className={`text-lg font-bold mb-4 border-l-4 pl-3 ${
          color === "blue"
            ? "border-blue-500 text-blue-600"
            : "border-green-500 text-green-600"
        }`}
      >
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 italic">No {title} found</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full bg-white">
            <thead
              className={`text-white ${
                color === "blue" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Parcel ID</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Payment Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b, i) => (
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{i + 1}</td>
                  <td className="py-3 px-4 font-mono">{b.parcelId}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        b.status === "success"
                          ? "bg-green-100 text-green-700"
                          : b.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : b.status === "cancel"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-700">
                    {b.amount} BDT
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(b.payment_time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        💳 Your Booking History
      </h1>

      <Table title="SSLCommerz Payments" data={sslBookings} color="green" />
      <Table title="Stripe Payments" data={stripeBookings} color="blue" />
    </div>
  );
}
