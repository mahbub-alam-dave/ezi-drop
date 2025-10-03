// src>app>(s)ite>(allPages)>order>page.jsx
"use client";

import { useEffect, useState } from "react";

export default function RiderDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalParcel, setModalParcel] = useState(null);
  const [parcelIdInput, setParcelIdInput] = useState("");
  const [riderId, setRiderId] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const riderRes = await fetch("/api/getRiderId");
      if (!riderRes.ok) throw new Error("Failed to get Rider ID");
      const riderData = await riderRes.json();

      const riderId = riderData.riderId;

      const res = await fetch(`/api/pending?riderId=${riderId}`);
      if (!res.ok) throw new Error("Failed to fetch parcels");
      const result = await res.json();

      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markParcelDone = async () => {
    try {
      const res = await fetch("/api/updatestatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: parcelIdInput }),
      });
      if (!res.ok) throw new Error("Failed to update parcel status");
      setParcelIdInput("");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Parcel Hand over function
  const parcelHanaover = async () => {
    try {
      const res = await fetch("/api/parcelHandover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: parcelIdInput }),
      });
      if (!res.ok) throw new Error("Failed to hand over parcel");
      setParcelIdInput("");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };
  // Invitation accept function
  const acceptInvitation = async () => {
    try {
      const res = await fetch("/api/acceptInvitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId }),
      });
      if (!res.ok) throw new Error("Failed to accept invitation");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Invitation reject function
  const rejectInvitation = async () => {
    try {
      const res = await fetch("/api/rejectInvitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId }),
      });
      if (!res.ok) throw new Error("Failed to reject invitation");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Error: {error}
      </div>
    );

  const riderStatus = data.pendingCount > 0 ? "busy" : "active";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 border-b pb-2">
        Your Work Information
      </h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold">Status</h2>
          <p
            className={`mt-2 px-3 py-1 rounded-full text-white font-bold ${
              riderStatus === "active" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            {riderStatus.toUpperCase()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold">Total Pending</h2>
          <p className="mt-2 text-2xl font-bold">{data.pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold">Total Completed</h2>
          <p className="mt-2 text-2xl font-bold">{data.completedCount}</p>
        </div>
      </div>

      {/* Invite Card */}
      {true && (
        <div className="flex justify-between border bg-[var(--color-primary)] px-6 py-4 mb-4 rounded-2xl text-[var(--color-text-dark)]">
          <div className="flex justify-center items-center">
            <p className="font-bold">Your invation</p>
          </div>
          <div className="space-x-2 flex justify-center items-center">
            <button onClick={acceptInvitation} className="border px-2 py-1">
              Accept
            </button>
            <button onClick={rejectInvitation} className="border px-2 py-1">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Mark Parcel Done */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Enter Parcel ID"
          value={parcelIdInput}
          onChange={(e) => setParcelIdInput(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        />
        <button
          onClick={markParcelDone}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>

      {/* Parcel Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Sender Name</th>
              <th className="px-4 py-2 text-left">Sender Phone</th>
              <th className="px-4 py-2 text-left">Receiver Name</th>
              <th className="px-4 py-2 text-left">Receiver Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...data.pendingParcels, ...data.completedParcels].map(
              (parcel) => (
                <tr
                  key={parcel._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2">{parcel.senderName}</td>
                  <td className="px-4 py-2">{parcel.senderPhone}</td>
                  <td className="px-4 py-2">{parcel.receiverName}</td>
                  <td className="px-4 py-2">{parcel.receiverPhone}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        parcel.assignedRider.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {parcel.assignedRider.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setModalParcel(parcel);
                        setShowModal(true);
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {showModal && modalParcel && (
        <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black/70 flex justify-center items-start z-50 px-4 overflow-y-auto">
          <div
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
           p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700
           mt-4 max-h-[calc(100vh-64px-40px)] overflow-y-auto"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              📦 Parcel Details
            </h2>

            {/* Content */}
            <div className="space-y-8">
              {/* Payment */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Payment
                  </p>
                  <p className="font-semibold capitalize">
                    {modalParcel.payment}
                  </p>
                </div>
              </div>

              {/* Sender */}
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200">
                  👤 Sender
                </h3>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {modalParcel.senderName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {modalParcel.senderPhone}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {modalParcel.senderEmail}
                </p>
                <p>
                  <span className="font-semibold">Pickup Address:</span>{" "}
                  {modalParcel.pickupAddress}, {modalParcel.pickupUpazila},{" "}
                  {modalParcel.pickupDistrict}
                </p>
              </div>

              {/* Receiver */}
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200">
                  📍 Receiver
                </h3>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {modalParcel.receiverName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {modalParcel.receiverPhone}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {modalParcel.receiverEmail}
                </p>
                <p>
                  <span className="font-semibold">Delivery Address:</span>{" "}
                  {modalParcel.deliveryAddress}, {modalParcel.deliveryUpazila},{" "}
                  {modalParcel.deliveryDistrict}
                </p>
              </div>

              {/* Percel Handover */}
              <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="Enter Rider ID"
                  value={parcelIdInput}
                  onClick={(e) => setRiderId(e.target.value)}
                  className="border rounded px-4 py-2 w-full md:w-1/3"
                />
                <button
                  onClick={parcelHanaover}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Hand Over
                </button>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200">
                  🚦 Status
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    modalParcel.assignedRider.status === "pending"
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {modalParcel.assignedRider.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-8 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
