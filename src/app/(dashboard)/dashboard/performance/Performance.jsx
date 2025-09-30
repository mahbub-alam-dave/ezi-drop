"use client";

import React, { useMemo } from "react";
import { Star, CheckCircle, Trophy, Hash } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";


export default function Performance() {
  // 📊 ডেমো ডেটা (পরে API ফেচ করতে পারবেন)
  const data = {
    totalDeliveries: 1240,
    successfulDeliveries: 1168,
    ratings: [5, 4, 5, 4, 5, 3, 5, 4],
    totalPoints: 3480,
    monthly: [
      { month: "Jan", deliveries: 90, success: 85, points: 280 },
      { month: "Feb", deliveries: 100, success: 95, points: 300 },
      { month: "Mar", deliveries: 110, success: 102, points: 320 },
      { month: "Apr", deliveries: 95, success: 88, points: 260 },
      { month: "May", deliveries: 130, success: 125, points: 380 },
      { month: "Jun", deliveries: 140, success: 132, points: 420 },
      { month: "Jul", deliveries: 150, success: 140, points: 440 },
      { month: "Aug", deliveries: 160, success: 150, points: 460 },
      { month: "Sep", deliveries: 165, success: 151, points: 500 },
    ],
  };

  // 📈 Success Rate & Rating ক্যালকুলেশন
  const successRate = useMemo(() => {
    return ((data.successfulDeliveries / data.totalDeliveries) * 100).toFixed(1);
  }, [data.totalDeliveries, data.successfulDeliveries]);

  const avgRating = useMemo(() => {
    const sum = data.ratings.reduce((s, r) => s + r, 0);
    return (sum / data.ratings.length).toFixed(2);
  }, [data.ratings]);

  const pointsGoal = 5000;
  const pointsProgress = Math.min(
    100,
    Math.round((data.totalPoints / pointsGoal) * 100)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Performance Dashboard</h1>

      {/* 📦 টপ মেট্রিক কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Deliveries" value={data.totalDeliveries} icon={<Hash size={28} />} />
        <MetricCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={<CheckCircle size={28} />}
          progress={successRate}
          progressLabel="Based on successful vs total"
          color="from-emerald-400 to-cyan-500"
        />
        <MetricCard
          title="Average Rating"
          value={
            <>
              {avgRating} <Star className="inline-block text-yellow-500" size={18} />
            </>
          }
          icon={<Star size={28} />}
        />
        <MetricCard
          title="Total Points"
          value={data.totalPoints}
          icon={<Trophy size={28} />}
          progress={pointsProgress}
          progressLabel={`Goal: ${pointsGoal} pts`}
          color="from-amber-400 to-red-500"
        />
      </div>

      {/* 📈 চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 📊 Bar Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 h-80">
          <h3 className="font-semibold mb-2">Monthly Deliveries</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#3b82f6" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📈 Line Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 h-80">
          <h3 className="font-semibold mb-2">Success & Points</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="points" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-4">Quick Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Breakdown label="Successful Deliveries" value={data.successfulDeliveries} />
          <Breakdown label="Failed Deliveries" value={data.totalDeliveries - data.successfulDeliveries} />
          <Breakdown label="Total Ratings" value={data.ratings.length} />
        </div>
      </div>
    </div>
  );
}

/* 🔧 Reusable Components */

function MetricCard({ title, value, icon, progress, progressLabel, color }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">{icon}</div>
      </div>
      {progress && (
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {progressLabel}
          </p>
        </div>
      )}
    </div>
  );
}

function Breakdown({ label, value }) {
  return (
    <div className="p-3 border rounded dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
