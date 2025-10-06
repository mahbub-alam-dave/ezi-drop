"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TrackParcelTable() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await fetch("/api/parcels");
        if (!res.ok) throw new Error("Failed to fetch parcels");
        const data = await res.json();
        console.log("📦 Parcel data:", data.data);
        setParcels(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, []);

  if (loading)
    return (
      <div className="text-red-400 dark:text-red-300 p-4">
        Loading user parcels...
      </div>
    );

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 divide-y divide-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Receiver Name
            </th>
            <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              Delivery Address
            </th>
            <th className="px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {parcels.map((parcel) => (
            <tr
              key={parcel._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 break-words">
                {parcel.receiverName}
              </td>
              <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 break-words max-w-[200px]">
                {parcel.deliveryLocation?.display_name}
              </td>
              <td className="px-3 py-2 text-center">
                <Link
                  href={`/dashboard/track-parcel/${parcel._id}`}
                  className="inline-block bg-blue-500 dark:bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
                >
                  Show Tracking
                </Link>
              </td>
            </tr>
          ))}
          {parcels.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm"
              >
                No parcels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
