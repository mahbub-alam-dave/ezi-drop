// src/components/RiderStatus/RiderStatus.jsx
"use client";

import React, { useState, useEffect } from "react";
import useAuthUser from "@/Hooks/useAuthUser";
import toast, { Toaster } from "react-hot-toast";

export default function RiderStatusInfo() {
  const { user, loading, session } = useAuthUser();
  const [status, setStatus] = useState("Vacation");
  const [updating, setUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user?.working_status) setStatus(user.working_status);
  }, [user]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setShowDropdown(false);
    setUpdating(true);

    const toastId = toast.loading("Updating your status...");

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ working_status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      toast.success(`Status updated to ${newStatus}!`, { id: toastId, icon: "✅" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status", { id: toastId, icon: "❌" });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      "On Duty": {
        color: "bg-green-500",
        dotColor: "bg-green-800",
        textColor: "text-green-100",
        borderColor: "border-green-400",
        icon: "🚗",
        description: "On a delivery"
      },
      "Vacation": {
        color: "bg-red-500",
        dotColor: "bg-yellow-500",
        textColor: "text-yellow-100",
        borderColor: "border-red-400",
        icon: "⏳",
        description: "On a vacation"
      },
    };
    return configs[status] || configs["Vacation"];
  };

  const statusConfig = getStatusConfig(status);

  if (loading) return (
    <div className="flex items-center bg-gray-300 dark:bg-gray-700 text-white py-2 px-4 rounded-lg animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-20 h-4 bg-gray-400 rounded"></div>
        <div className="w-24 h-8 bg-gray-400 rounded"></div>
      </div>
    </div>
  );

  if (!session || !user) return null;

  return (
    <div className="relative">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
        }}
      />

      {/* Status Button */}
      <div 
        className={`flex items-center ${statusConfig.color} text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg cursor-pointer border ${statusConfig.borderColor} ${
          updating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        onClick={() => !updating && setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
            <span className="text-sm font-medium">Status:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{status}</span>
            <span className="text-sm">{statusConfig.icon}</span>
          </div>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {updating && <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && !updating && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden animate-fade-in">
          {["On Duty", "Vacation"].map((option) => {
            const optionConfig = getStatusConfig(option);
            return (
              <button
                key={option}
                onClick={() => handleStatusChange(option)}
                className={`w-full flex items-center gap-3 p-3 text-left transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  status === option ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${optionConfig.dotColor}`}></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{option}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{optionConfig.description}</div>
                </div>
                {status === option && <span className="text-blue-500 text-lg">✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Click Outside Listener */}
      {showDropdown && <div className="fixed inset-0 z-0" onClick={() => setShowDropdown(false)} />}
    </div>
  );
}
