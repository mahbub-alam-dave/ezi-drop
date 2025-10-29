"use client";

import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

export default function RiderStatus() {
  const [status, setStatus] = useState("offline"); // default
  const [riderId, setRiderId] = useState(null);
  const [email, setEmail] = useState("");

  // Get current rider info from session
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session && session.user.role === "rider") {
        setRiderId(session.user.id);
        setEmail(session.user.email);
        setStatus(session.user.status || "offline");
      }
    };
    fetchSession();
  }, []);

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId, updates: { status: newStatus } }),
      });

      const data = await res.json();
      if (data.success) setStatus(newStatus);
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-4 border rounded-md w-64">
      <h2 className="text-lg font-semibold mb-2">Rider Info</h2>
      <p className="mb-2">
        <strong>Email:</strong> {email}
      </p>
      <p className="mb-4">
        <strong>Status:</strong> {status}
      </p>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => updateStatus("online")}
        >
          Online
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => updateStatus("offline")}
        >
          Offline
        </button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded"
          onClick={() => updateStatus("busy")}
        >
          Busy
        </button>
      </div>
    </div>
  );
}
