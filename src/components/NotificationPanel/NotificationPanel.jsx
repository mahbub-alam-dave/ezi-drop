"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function NotificationPanel({ userId, onUnseenChange }) {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const handleAction = async (action, notificationId = null) => {
    try {
      const res = await fetch("/api/notifications/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, notificationId }),
      });

      if (!res.ok) throw new Error(`Failed to perform action: ${action}`);

      if (action === "mark_all_seen") {
        setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
        setUnseenCount(0);
        onUnseenChange(0);
      } else {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error handling notification action:", error);
    }
  };

  // Fetching Notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data.notifications);
      setUnseenCount(data.unseenCount);
      onUnseenChange(data.unseenCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [userId, onUnseenChange]);

  // 10 min Initial fetch
  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  useEffect(() => {
    if (isOpen && unseenCount > 0) {
      handleAction("mark_all_seen");
    }
  }, [isOpen, unseenCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef]);

  if (!userId) return null;

  return (
    <div className="" ref={panelRef}>
      {/* Notification Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 relative rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {/* Red Dot Indicator */}
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        )}

        {/* Bell Icon SVG */}
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.437 5.762 6 7.828 6 10v4.158a2.032 2.032 0 01-.595 1.437L4 17h5m6 0a2 2 0 100 4 2 2 0 000-4zm-6 0a2 2 0 100 4 2 2 0 000-4z"
          ></path>
        </svg>
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <button
              onClick={() => handleAction("clear_all")}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <a
                  key={n._id}
                  href={n.link}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    !n.seen ? "bg-blue-50 dark:bg-gray-700/50" : ""
                  }`}
                >
                  <div className="flex-grow">
                    <p
                      className={`text-sm ${
                        !n.seen
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAction("delete_individual", n._id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500 text-sm"
                    title="Delete"
                  >
                    &times;
                  </button>
                </a>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
