"use client";
import React, { useState, useMemo } from "react";

export default async function ManageOrders() {
  // Fake order data
  // const orders = await fetch("/api/parcels").then((res) => res.json()).then(data => data.data);
  const orders = [
    {
      id: "1001",
      customer: "Karim Hossain",
      rider: "Rahim Khan",
      address: "House 12, Road 4, Dhanmondi",
      status: "pending",
      date: "2025-09-25",
    },
    {
      id: "1002",
      customer: "Fahim Ahmed",
      rider: "Nusrat Jahan",
      address: "Sector 7, Uttara",
      status: "in-transit",
      date: "2025-09-24",
    },
    {
      id: "1003",
      customer: "Tareq Mahmud",
      rider: "Rahim Khan",
      address: "Banani 11",
      status: "delivered",
      date: "2025-09-23",
    },
    {
      id: "1004",
      customer: "Sadia Akter",
      rider: "Tareq Mahmud",
      address: "Mirpur 10",
      status: "cancelled",
      date: "2025-09-22",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        order.customer.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.rider.toLowerCase().includes(q);
      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          color: "text-yellow-700",
          bg: "bg-yellow-100",
          icon: "🟡",
        };
      case "in-transit":
        return {
          text: "In Transit",
          color: "text-blue-700",
          bg: "bg-blue-100",
          icon: "🚚",
        };
      case "delivered":
        return {
          text: "Delivered",
          color: "text-green-700",
          bg: "bg-green-100",
          icon: "✅",
        };
      case "cancelled":
        return {
          text: "Cancelled",
          color: "text-red-700",
          bg: "bg-red-100",
          icon: "❌",
        };
      default:
        return {
          text: "Unknown",
          color: "text-gray-700",
          bg: "bg-gray-100",
          icon: "❓",
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 background-color min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-color">Manage Orders</h1>
          <p className="text-color-soft mt-2 max-w-2xl mx-auto sm:mx-0">
            Track and manage customer orders, riders, and delivery status in
            real time.
          </p>
        </div>

        {/* Controls Card */}
        <div className="background-color rounded-2xl shadow-lg p-5 mb-5 border border-[var(--color-border)] dark:border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white/90 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-color whitespace-nowrap">
                Filter by Status:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-style min-w-[160px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="background-color rounded-2xl shadow-lg overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-border)] dark:divide-[var(--color-border)]">
              <thead className="background-color">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Rider",
                    "Address",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-color-soft uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border)]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const s = getStatusConfig(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="transition-all duration-200 hover:bg-[var(--color-bg-dark)/5] dark:hover:bg-[var(--color-text-soft-dark)/10] group"
                      >
                        <td className="px-6 py-5 font-mono text-color">
                          #{order.id}
                        </td>
                        <td className="px-6 py-5 text-color">
                          {order.customer}
                        </td>
                        <td className="px-6 py-5 text-color">{order.rider}</td>
                        <td className="px-6 py-5 text-color">
                          {order.address}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{s.icon}</span>
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${s.bg} ${s.color}`}
                            >
                              {s.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-color">
                          {order.date}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => alert(`View order ${order.id}`)}
                              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)/10] hover:bg-[var(--color-primary)/20] rounded-lg transition-all duration-200 group-hover:shadow-sm"
                            >
                              👁️
                              <span className="ml-1 hidden sm:inline">
                                View
                              </span>
                            </button>
                            <button className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-color-soft bg-[var(--color-border)/30] hover:bg-[var(--color-border)/50] rounded-lg transition-all duration-200 group-hover:shadow-sm">
                              ✏️
                              <span className="ml-1 hidden sm:inline">
                                Edit
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl mb-4 text-color-soft">📦</div>
                        <h3 className="text-lg font-medium text-color mb-1">
                          No orders found
                        </h3>
                        <p className="text-color-soft max-w-md">
                          Try adjusting your search terms or filter criteria.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedStatus("all");
                          }}
                          className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer stats */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-color-soft background-color rounded-xl p-4 border border-[var(--color-border)] dark:border-[var(--color-border)]">
          <div>
            Showing{" "}
            <span className="font-semibold text-color">
              {filteredOrders.length}
            </span>{" "}
            of <span className="font-semibold text-color">{orders.length}</span>{" "}
            orders
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>
                Delivered:{" "}
                {orders.filter((o) => o.status === "delivered").length}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>
                Pending: {orders.filter((o) => o.status === "pending").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
