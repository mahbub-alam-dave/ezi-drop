"use client";

import { useEffect, useState } from "react";

export default function RiderDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalParcel, setModalParcel] = useState(null);
  const [parcelIdInput, setParcelIdInput] = useState("");
  const [invitedRiderId, setInvitedRiderId] = useState("");
  const [myRiderId, setMyRiderId] = useState(""); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const riderRes = await fetch("/api/getRiderId");
      if (!riderRes.ok) throw new Error("Failed to get Rider ID");
      const riderData = await riderRes.json();

      const riderId = riderData.riderId;
      setMyRiderId(riderId); 

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
        body: JSON.stringify({ parcelId: parcelIdInput, riderId: myRiderId }), 
      });
      if (!res.ok) throw new Error("Failed to update parcel status");
      setParcelIdInput("");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Parcel Hand over function
  const parcelHanaover = async (parcelId, invitedId) => {
    
    if (!invitedId) return alert("Please enter the Rider ID to hand over to.");
    try {
      const res = await fetch("/api/parcelHandover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: parcelId,
          currentRiderId: myRiderId, 
          invitedRiderId: invitedId, 
        }),
      });
      if (!res.ok) throw new Error("Failed to hand over parcel");
      alert("Handover invitation sent successfully.");
      setInvitedRiderId("");
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Invitation/Auto-Assignment accept function (Accept/Confirm)
  const acceptInvitation = async (parcelId) => {
    try {
      const res = await fetch("/api/acceptInvitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId, riderId: myRiderId }), // parcelId এবং myRiderId পাঠানো হচ্ছে
      });
      if (!res.ok) throw new Error("Failed to accept assignment/invitation");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Invitation/Auto-Assignment reject function (Reject)
  const rejectInvitation = async (parcelId) => {
    try {
      const res = await fetch("/api/rejectInvitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId, riderId: myRiderId }), // parcelId এবং myRiderId পাঠানো হচ্ছে
      });
      if (!res.ok) throw new Error("Failed to reject assignment/invitation");
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

  const parcelsToRespond = data.pendingParcels.filter(
    (parcel) =>
      parcel.assignedRider.status === "auto_assigned" ||
      (parcel.assignedRider.handoverInvitedRider?.riderId ===
        myRiderId.toString() &&
        parcel.assignedRider.handoverInvitedRider?.status === "invited")
  );

  const hasHandoverInvitation = parcelsToRespond.find(
    (parcel) =>
      parcel.assignedRider.handoverInvitedRider?.riderId ===
        myRiderId.toString() &&
      parcel.assignedRider.handoverInvitedRider?.status === "invited"
  );

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

      {/* Auto-Assigned Parcel/Handover Invitation Actions Card: Accept/Reject */}
      {parcelsToRespond.length > 0 && (
        <div className="mb-8 p-6 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-red-700 dark:text-red-300">
            ⏰ New Action Required Parcels
          </h2>
          {parcelsToRespond.map((parcel) => (
            <div
              key={parcel._id}
              className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 mb-3 rounded-lg border border-red-200 dark:border-red-600"
            >
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                Parcel ID:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {parcel.parcelId}
                </span>{" "}
                -{" "}
                {parcel.assignedRider.status === "auto_assigned"
                  ? "Auto-Assigned"
                  : "Handover Invitation"}
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => acceptInvitation(parcel._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-150"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectInvitation(parcel._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-150"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {!hasHandoverInvitation && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-4">
              *You have 1 hour to respond to an auto-assigned parcel, or it will
              be reassigned, and you will receive a -100 penalty.
            </p>
          )}
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
                        parcel.assignedRider.status === "auto_assigned"
                          ? "bg-red-500" 
                          : parcel.assignedRider.status === "pending"
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
                        setInvitedRiderId(""); // Modal input reset
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

              {/* Percel Handover - Manual handover option */}
              {modalParcel.assignedRider.status === "pending" && ( 
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Enter Rider ID to Hand Over To"
                    value={invitedRiderId} 
                    onChange={(e) => setInvitedRiderId(e.target.value)} 
                    className="border rounded px-4 py-2 w-full"
                  />
                  <button
                    onClick={() =>
                      parcelHanaover(modalParcel._id, invitedRiderId)
                    } 
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 whitespace-nowrap"
                    disabled={!invitedRiderId}
                  >
                    Hand Over Parcel
                  </button>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-200">
                  🚦 Status
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    modalParcel.assignedRider.status === "auto_assigned"
                      ? "bg-red-400 text-red-900"
                      : modalParcel.assignedRider.status === "pending"
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {modalParcel.assignedRider.status.toUpperCase()}
                </span>
                {modalParcel.assignedRider.handoverInvitedRider && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Handover Invited:{" "}
                    <span className="font-semibold">
                      {modalParcel.assignedRider.handoverInvitedRider.riderName}
                    </span>{" "}
                    (Status:{" "}
                    {modalParcel.assignedRider.handoverInvitedRider.status.toUpperCase()}
                    )
                  </p>
                )}
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
