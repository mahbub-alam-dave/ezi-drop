"use client";
import React, { useState, useMemo, useEffect } from "react";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- Pagination State: Initial limit is 20 ---
  const [displayLimit, setDisplayLimit] = useState(20);

  // --- New State for Modal ---
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --------------------------

  // --- Firebase/API Fetching Logic (using mock URL for demonstration) ---
  useEffect(() => {
    fetch("http://localhost:3000/api/parcels")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch parcels");
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          // Mocking additional parcel data for full display requirement
          const enhancedData = data.data.map((order) => ({
            ...order,
            weight:
              order.weight || `${(Math.random() * 5 + 0.5).toFixed(1)} kg`, // Mock weight
            paymentMethod:
              order.paymentMethod ||
              (Math.random() > 0.5 ? "Cash on Delivery" : "Online Payment"), // Mock payment method
            parcelContent:
              order.parcelContent || "Assorted Merchandise/Electronics", // Mock content
            notes: order.notes || "Handle with care. Call before 10 AM.", // Mock notes
            // ADDED MOCK TRANSACTION ID
            transactionId:
              order.transactionId ||
              `TXN-${Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()}`,
          }));
          setOrders(enhancedData);
        }
      })
      .catch((err) => console.error("Error fetching parcel data:", err))
      .finally(() => setLoading(false));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // --- New Handler for View Button ---
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  // ------------------------------------

  // --- Helper Function: Normalizes the status for consistent filtering/display ---
  const normalizedStatus = (status) => {
    // If status is null/undefined or error, return 'unknown'
    if (!status) return "unknown";
    const lowerStatus = status.toLowerCase();

    // Maps database statuses to UI/Filter statuses
    if (lowerStatus === "not_picked") return "pending"; // Your DB status mapped to UI 'pending'
    if (
      lowerStatus === "handover" ||
      lowerStatus === "out_for_delivery" ||
      lowerStatus === "assigned"
    )
      return "in-transit";

    return lowerStatus; // 'delivered', 'cancelled', 'pending' (if used directly)
  };

  const filteredOrders = useMemo(() => {
    // Reset display limit when filter changes
    setDisplayLimit(20);

    return orders.filter((order) => {
      const q = searchTerm.toLowerCase();

      // Safety check for null/undefined fields
      const receiverName = order.receiverName?.toLowerCase() || "";
      const orderId = order._id?.toLowerCase() || "";
      const riderName = order.assignedRider?.riderName?.toLowerCase() || ""; // Access rider name safely

      // Search logic updated to use correct fields: receiverName, _id, riderName
      const matchesSearch =
        receiverName.includes(q) ||
        orderId.includes(q) ||
        riderName.includes(q);

      const currentStatus = normalizedStatus(order.status);
      const matchesStatus =
        selectedStatus === "all" || currentStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, orders]);

  // --- Helper Function: Gets configuration for the normalized status ---
  const getStatusConfig = (status) => {
    const s = normalizedStatus(status); // Use normalized status for switch

    switch (s) {
      case "pending":
        return {
          text: "Pending",
          color: "text-yellow-700 dark:text-yellow-300",
          bg: "bg-yellow-100 dark:bg-yellow-800",
          icon: "🟡",
        };
      case "in-transit":
        return {
          text: "In Transit",
          color: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-100 dark:bg-blue-800",
          icon: "🚚",
        };
      case "delivered":
        return {
          text: "Delivered",
          color: "text-green-700 dark:text-green-300",
          bg: "bg-green-100 dark:bg-green-800",
          icon: "✅",
        };
      case "cancelled":
        return {
          text: "Cancelled",
          color: "text-red-700 dark:text-red-300",
          bg: "bg-red-100 dark:bg-red-800",
          icon: "❌",
        };
      default:
        return {
          text: status?.toUpperCase() || "UNKNOWN",
          color: "text-gray-700 dark:text-gray-300",
          bg: "bg-gray-100 dark:bg-gray-800",
          icon: "❓",
        };
    }
  };

  // Helper Component for Modal Content (Used for 2-column grid items)
  const DetailItem = ({ label, value, statusConfig }) => (
    <div className="flex justify-between items-center py-1">
      <span className="font-medium text-gray-900 dark:text-gray-200 text-sm">
        {label}:
      </span>
      {statusConfig ? (
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}
        >
          {statusConfig.icon} {value}
        </span>
      ) : (
        <span className="text-gray-600 dark:text-gray-400 font-normal break-words max-w-[60%] text-right text-sm">
          {value}
        </span>
      )}
    </div>
  );

  // Helper Component for Full Width Items (Used for Address/Notes)
  const FullRowItem = ({ label, value }) => (
    <div className="flex flex-col items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="font-medium text-gray-900 dark:text-gray-200 mb-1 text-sm">
        {label}:
      </span>
      <span className="text-gray-600 dark:text-gray-400 font-normal break-words w-full text-left text-sm">
        {value}
      </span>
    </div>
  );

  // Handler for "Show More" button
  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + 20);
  };

  // Display loading message
  if (loading) {
    return (
      <div className="p-10 text-center text-xl text-gray-600 dark:text-gray-300 min-h-screen flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading orders...
      </div>
    );
  }

  // Orders to be displayed after slicing
  const ordersToDisplay = filteredOrders.slice(0, displayLimit);
  const remainingOrders = filteredOrders.length - displayLimit;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Manage Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto sm:mx-0">
            Track and manage customer orders, riders, and delivery status in
            real time.
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by Customer name, Order ID, or Rider..."
                className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Filter by Status:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block min-w-[160px] px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending (Not Picked)</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    "Order ID",
                    "Customer Name",
                    "Rider",
                    "Delivery Address",
                    "Status",
                    "Payment Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {ordersToDisplay.length > 0 ? (
                  ordersToDisplay.map((order) => {
                    const s = getStatusConfig(order.status);

                    // --- MAPPED DATA FIELDS ---
                    const riderName =
                      order.assignedRider?.riderName || "Not Assigned";

                    // Full ID Display Requested by User
                    const orderIdFull = order._id || "N/A";

                    const paymentDate = order.paymentDate
                      ? new Date(order.paymentDate).toLocaleDateString("en-GB")
                      : "N/A";
                    // --------------------------

                    return (
                      <tr
                        key={order._id}
                        className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 font-mono text-gray-900 dark:text-white text-sm">
                          {/* FULL ID DISPLAY - Removed truncation */}
                          <span
                            title={orderIdFull}
                            className="whitespace-normal block"
                          >
                            #{orderIdFull}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap">
                          {order.receiverName}
                        </td>
                        <td className="px-6 py-4 text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap">
                          {riderName}
                        </td>
                        {/* FULL DELIVERY ADDRESS - Removed truncation */}
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm whitespace-normal max-w-sm">
                          {order.deliveryAddress}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{s.icon}</span>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${s.bg} ${s.color} whitespace-nowrap`}
                            >
                              {s.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 text-sm">
                          {paymentDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            {/* Updated View Button to open Modal */}
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all duration-200 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900"
                            >
                              👁️
                              <span className="ml-1 hidden sm:inline">
                                View
                              </span>
                            </button>
                            <button className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-200 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">
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
                        <div className="text-5xl mb-4 text-gray-300 dark:text-gray-600">
                          📦
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                          No orders found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                          Try adjusting your search terms or filter criteria.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedStatus("all");
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
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

        {/* Show More Button */}
        {remainingOrders > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={handleShowMore}
              className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Show More ({Math.min(remainingOrders, 20)} orders remaining)
            </button>
          </div>
        )}

        {/* Footer stats */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-md">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {ordersToDisplay.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredOrders.length}
            </span>{" "}
            filtered orders. Total:{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {orders.length}
            </span>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>
                Delivered:{" "}
                {
                  orders.filter(
                    (o) => normalizedStatus(o.status) === "delivered"
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>
                Pending:{" "}
                {
                  orders.filter((o) => normalizedStatus(o.status) === "pending")
                    .length
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- View Order Modal --- */}
      {/* Z-index 60 ensures it is displayed above everything else. */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-gray-900 bg-opacity-75 dark:bg-opacity-80 flex items-center justify-center p-4">
          {/* Responsive Modal Container - max-w-xl on desktop and responsive height */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-full sm:max-w-lg md:max-w-xl transform transition-all duration-300 scale-100 m-2 sm:m-4 max-h-[auto]">
            <div className="flex flex-col h-full p-4 sm:p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 flex-shrink-0">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Modal Body: Added flex-grow and overflow-y-auto for internal scrolling */}
              <div className="space-y-4 text-gray-700 dark:text-gray-300 overflow-y-auto flex-grow">
                {/* Full ID Display - Single Column */}
                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded-md break-all">
                  <span className="font-semibold text-gray-900 dark:text-white mr-2">
                    Full Order ID:
                  </span>
                  {selectedOrder._id}
                </p>
                {/* Customer Details - 2 Column Grid on medium/large screens */}
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  Customer Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  <DetailItem
                    label="Customer Name"
                    value={selectedOrder.receiverName}
                  />
                  <DetailItem
                    label="Contact Number"
                    value={selectedOrder.receiverPhone || "N/A"}
                  />
                  <DetailItem
                    label="Rider Assigned"
                    value={selectedOrder.assignedRider?.riderName || "N/A"}
                  />
                </div>
                <div className="mt-4 border-b border-gray-100 dark:border-gray-700 sm:border-b-0"></div>{" "}
                {/* Visual Separator */}
                {/* Parcel & Status Details - 2 Column Grid on medium/large screens */}
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  Parcel & Delivery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  <DetailItem
                    label="Parcel Weight"
                    value={selectedOrder.weight || "N/A"}
                  />
                  <DetailItem
                    label="Payment Method"
                    value={selectedOrder.paymentMethod || "N/A"}
                  />
                  {/* ADDED TRANSACTION ID HERE */}
                  <DetailItem
                    label="Transaction ID"
                    value={selectedOrder.transactionId || "N/A"}
                  />
                  <DetailItem
                    label="Payment Date"
                    value={
                      selectedOrder.paymentDate
                        ? new Date(
                            selectedOrder.paymentDate
                          ).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"
                    }
                  />
                  <DetailItem
                    label="Current Status"
                    value={getStatusConfig(selectedOrder.status).text}
                    statusConfig={getStatusConfig(selectedOrder.status)}
                  />
                </div>
                <div className="mt-4 border-b border-gray-100 dark:border-gray-700 sm:border-b-0"></div>{" "}
                {/* Visual Separator */}
                {/* Full Address and Notes - Single Column, always full width */}
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  Address & Notes
                </h4>
                <FullRowItem
                  label="Delivery Address"
                  value={selectedOrder.deliveryAddress}
                />
                <FullRowItem
                  label="Special Notes"
                  value={selectedOrder.notes || "No special instructions."}
                />
              </div>

              {/* Modal Footer - Added flex-shrink-0 */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
