"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

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
console.log(parcels, userEmail)
  if (!session) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠️ Please log in to view your bookings.
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
  {/* Header Section */}
  {/* max-w-7xl mx-auto */}
  <div className="w-full">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div className="mb-6 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl">📦</span>
          </div>
          My Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage all your parcel shipments
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{parcels.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-orange-500">{parcels.filter(p => p.status === 'not_picked').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">In Transit</p>
          <p className="text-2xl font-bold text-blue-500">{parcels.filter(p => p.status === 'in_transit').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
          <p className="text-2xl font-bold text-green-500">{parcels.filter(p => p.status === 'delivered').length}</p>
        </div>
      </div>
    </div>

    {/* Search & Filter Section */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Parcel ID, District, or Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer transition-all duration-200"
          >
            <option value="">All Status</option>
            <option value="not_picked">Not Picked</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>

    {/* Table Section */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Parcel Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {parcels.length > 0 ? (
              parcels.map((parcel) => (
                <tr 
                  key={parcel._id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        📦
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {parcel.parcelId}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(parcel.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {parcel.pickupDistrict}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          → {parcel.deliveryDistrict}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {parcel.amount} ৳
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      parcel.payment === "done" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {parcel.payment === "done" ? "✅ Paid" : "❌ Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      parcel.status === "delivered" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : parcel.status === "in_transit"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    }`}>
                      {parcel.status === "delivered" ? "🚚 Delivered" : 
                       parcel.status === "in_transit" ? "🔄 In Transit" : "📦 Not Picked"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <Link
                      href={`/dashboard/user/track-parcel/${parcel._id}`}
                      className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <div className="w-24 text-sm">Track Parcel</div>
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
                  </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">📦</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No parcels found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      {search || statusFilter 
                        ? "Try adjusting your search or filter criteria" 
                        : "You haven't created any parcel bookings yet"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {parcels.length > 0 ? (
          parcels.map((parcel) => (
            <div 
              key={parcel._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    📦
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {parcel.parcelId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(parcel.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  parcel.payment === "done" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                  {parcel.payment === "done" ? "Paid" : "Pending"}
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-center flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {parcel.pickupDistrict}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                </div>
                <div className="mx-2 text-gray-400">→</div>
                <div className="text-center flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {parcel.deliveryDistrict}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {parcel.amount} ৳
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  parcel.status === "delivered" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : parcel.status === "in_transit"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                }`}>
                  {parcel.status === "delivered" ? "Delivered" : 
                   parcel.status === "in_transit" ? "In Transit" : "Not Picked"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No parcels found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search || statusFilter ? "Try different search terms" : "No bookings yet"}
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border transition-all duration-200 font-medium ${
              p === page 
                ? "bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    )}
  </div>
</div>
  );
}
