"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch } from "react-icons/fa";

export default function MyBookingPage() {
  const { data: session, status } = useSession();
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchParcels = async () => {
      try {
        const query = new URLSearchParams({
          search,
          status: statusFilter,
          page,
          limit,
        });
        const res = await fetch(`/api/parcels/user/${userEmail}?${query}`);
        const data = await res.json();
        if (data.success) {
          setParcels(data.parcels);
          setTotal(data.total);
        }
      } catch (err) {
        console.error("Error fetching parcels:", err);
      }
    };

    fetchParcels();
  }, [search, statusFilter, page, userEmail]);

  const totalPages = Math.ceil(total / limit);

  if (status === "loading") {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!session) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Please log in to view your bookings.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 My Bookings</h2>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
        <div className="flex items-center border rounded-lg px-2 w-full sm:w-1/3">
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Parcel ID or District"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="not_picked">Not Picked</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Parcel ID</th>
              <th className="p-3 border">Pickup</th>
              <th className="p-3 border">Delivery</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length > 0 ? (
              parcels.map((parcel) => (
                <tr key={parcel._id} className="hover:bg-gray-50 text-center">
                  <td className="border p-2">{parcel.parcelId}</td>
                  <td className="border p-2">{parcel.pickupDistrict}</td>
                  <td className="border p-2">{parcel.deliveryDistrict}</td>
                  <td className="border p-2">{parcel.amount} ৳</td>
                  <td
                    className={`border p-2 ${
                      parcel.payment === "done" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {parcel.payment}
                  </td>
                  <td className="border p-2">{parcel.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No parcels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 border rounded ${
                p === page ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
