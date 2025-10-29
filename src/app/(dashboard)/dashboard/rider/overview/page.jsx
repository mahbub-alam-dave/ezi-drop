"use client";

/* import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Package, CheckCircle, Clock, DollarSign } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RiderOverviewPage() {
  const [date, setDate] = useState(new Date());

  const riderName = "Sefat";

  const stats = [
    { id: 1, title: "Active Deliveries", value: 3, icon: Package },
    { id: 2, title: "Completed Orders", value: 120, icon: CheckCircle },
    { id: 3, title: "Pending Orders", value: 5, icon: Clock },
    { id: 4, title: "Total Earnings", value: "$2450", icon: DollarSign },
  ];

  const recentDeliveries = [
    { id: 1, parcelId: "PCK-101", status: "Delivered", date: "2025-09-20" },
    { id: 2, parcelId: "PCK-102", status: "In Transit", date: "2025-09-21" },
    { id: 3, parcelId: "PCK-103", status: "Pending", date: "2025-09-22" },
  ];

  
  const radialData = [
    { name: "Today", value: 65, fill: "#3b82f6" },
    { name: "Target", value: 55, fill: "#ef4444" },
    { name: "This Year", value: 36, fill: "#10b981" },
  ];

  return (
    <div className="space-y-8 text-color p-6">
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Courier Rider
        </h1>
        <h2 className="text-2xl font-bold">Welcome back, {riderName} 👋</h2>
        <p className="text-color-soft">
          Here’s a quick look at your delivery performance today.
        </p>
      </div>

      <div className="background-color rounded-2xl shadow-md p-6 border border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold mb-6">Revenue Statistics</h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={20}
              data={radialData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="background-color rounded-2xl shadow-md p-6 flex items-center gap-4 border border-[var(--color-border)]"
          >
            <div className="p-3 background-color-primary rounded-xl">
              <stat.icon className="h-6 w-6 text-[var(--color-bg)]" />
            </div>
            <div>
              <p className="text-sm text-color-soft">{stat.title}</p>
              <p className="text-xl font-bold text-color">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Delivery Calendar</h2>
        <div className="background-color rounded-2xl shadow-md p-6 border border-[var(--color-border)]">
          <Calendar onChange={setDate} value={date} />
          <p className="mt-4">
            Selected Date:{" "}
            <span className="font-semibold text-color">{date.toDateString()}</span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Deliveries</h2>
        <div className="background-color rounded-2xl shadow-md p-6 overflow-x-auto border border-[var(--color-border)]">
          <table className="w-full border-collapse text-color">
            <thead>
              <tr className="text-left border-b border-[var(--color-border)] text-color-soft">
                <th className="py-2">Parcel ID</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="border-b last:border-none border-[var(--color-border)]"
                >
                  <td className="py-2">{delivery.parcelId}</td>
                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        delivery.status === "Delivered"
                          ? "background-color-primary text-[var(--color-bg)]"
                          : delivery.status === "In Transit"
                          ? "background-color-secondary text-[var(--color-bg)]"
                          : "bg-red-100 text-[var(--color-secondary)]"
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-2">{delivery.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} */

import { useState, useEffect } from "react";
import { Package, CheckCircle, Clock, DollarSign, TrendingUp, Star, MapPin } from "lucide-react";

export default function ImprovedRiderOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const res = await fetch("/api/rider-dashboard/profile-stats");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Failed to load overview data</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Deliveries",
      value: data.todayStats.activeDeliveries,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Completed Today",
      value: data.todayStats.completedToday,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Pending Pickup",
      value: data.todayStats.pendingPickup,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Earned Today",
      value: `৳${data.todayStats.earnedToday.toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {data.rider.name}! 👋
        </h1>
        <p className="text-blue-100">
          Ready to deliver excellence today? Here's your performance snapshot.
        </p>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs text-blue-100">Total Deliveries</p>
            <p className="text-2xl font-bold">{data.overallStats.totalDeliveries}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs text-blue-100">Success Rate</p>
            <p className="text-2xl font-bold">
              {data.overallStats.totalDeliveries > 0
                ? Math.round((data.overallStats.successfulDeliveries / data.overallStats.totalDeliveries) * 100)
                : 0}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs text-blue-100">Rating</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              {data.overallStats.averageRating.toFixed(1)}
              <Star size={18} className="text-yellow-300" />
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <p className="text-xs text-blue-100">Total Points</p>
            <p className="text-2xl font-bold">{data.overallStats.totalPoints}</p>
          </div>
        </div>
      </div>

      {/* Today's Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
  <stat.icon className="h-6 w-6 text-white" />
</div>
                {/* <stat.icon /> */}
              {stat.title === "Earned Today" && (
                <TrendingUp className="text-green-500" size={20} />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Active Deliveries Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Active Deliveries
          </h2>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
            {data.activeDeliveries.length} Active
          </span>
        </div>

        {data.activeDeliveries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>No active deliveries at the moment</p>
            <p className="text-sm mt-1">Check back for new assignments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.activeDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {delivery.trackingNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      To: {delivery.receiverName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {delivery.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    delivery.status === 'picked_up' 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : delivery.status === 'in_transit'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {delivery.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Deliveries
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tracking ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentDeliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-white">
                    {delivery.trackingNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      delivery.status === 'delivered'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : delivery.status === 'cancelled'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(delivery.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-md p-6 border border-purple-200 dark:border-purple-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Earnings Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Earnings</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ৳{data.todayStats.earnedToday.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              ৳{data.overallStats.totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
