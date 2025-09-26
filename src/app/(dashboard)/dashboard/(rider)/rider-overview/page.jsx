"use client";

import { useState } from "react";
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

  // RadialBarChart data
  const radialData = [
    { name: "Today", value: 65, fill: "#3b82f6" },
    { name: "Target", value: 55, fill: "#ef4444" },
    { name: "This Year", value: 36, fill: "#10b981" },
  ];

  return (
    <div className="space-y-8 text-color p-6">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Smart Courier Rider
        </h1>
        <h2 className="text-2xl font-bold">Welcome back, {riderName} 👋</h2>
        <p className="text-color-soft">
          Here’s a quick look at your delivery performance today.
        </p>
      </div>


      {/* Revenue Statistics Section with RadialBarChart */}
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

      {/* Rider Stats Section */}
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


      {/* Calendar Section */}
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


      {/* Recent Deliveries */}
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
}
