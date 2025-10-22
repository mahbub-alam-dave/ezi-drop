"use client";

import React, { useMemo, useState, useEffect } from "react";
import Swal from "sweetalert2";
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
import UserRating from "@/components/UserRating/UserRating";

export default function PerformancePage() {
  // ✅ Demo data directly in component
  const [data, setData] = useState({
    totalDeliveries: 180,
    successfulDeliveries: 150,
    totalPoints: 4200,
    ratings: [4, 5, 5, 3, 4, 5],
    monthly: [
      { month: "Jan", deliveries: 40, success: 35, points: 900 },
      { month: "Feb", deliveries: 30, success: 28, points: 700 },
      { month: "Mar", deliveries: 35, success: 33, points: 820 },
      { month: "Apr", deliveries: 25, success: 22, points: 620 },
      { month: "May", deliveries: 50, success: 45, points: 1160 },
    ],
  });

  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const successRate = useMemo(
    () => ((data.successfulDeliveries ?? 0) / (data.totalDeliveries || 1)) * 100,
    [data]
  );

  const avgRating = useMemo(() => {
    const ratings = data.ratings ?? [];
    return ratings.length === 0
      ? 0
      : (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
  }, [data]);

  const pointsGoal = 5000;
  const pointsProgress = Math.min(
    100,
    Math.round(((data.totalPoints ?? 0) / pointsGoal) * 100)
  );

  useEffect(() => {
    if (!ratingSubmitted && data) {
      if (data.totalPoints >= pointsGoal) {
        Swal.fire({
          title: "🎉 Congrats!",
          text: "Monthly points goal achieved!",
          icon: "success",
        });
      } else if (successRate < 80) {
        Swal.fire({
          title: "⚠️ Low Performance",
          text: "Success rate below 80%",
          icon: "warning",
        });
      }
    }
  }, [data, ratingSubmitted, successRate]);

  const handleRatingSubmit = (rating) => {
    setRatingSubmitted(true);
    Swal.fire({
      title: "Thanks!",
      text: `You rated ${rating} stars`,
      icon: "success",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 mb-8">
        Performance Dashboard
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Deliveries" value={data.totalDeliveries} icon={<Hash size={28} />} />
        <MetricCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          icon={<CheckCircle size={28} />}
          progress={successRate}
          progressLabel="Successful vs Total"
          color="from-emerald-400 to-cyan-500"
        />
        <MetricCard
          title="Average Rating"
          value={
            <>
              {avgRating}{" "}
              <Star className="text-yellow-500 inline-block" size={18} />
            </>
          }
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Deliveries">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#3b82f6" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Success & Points">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#f97316"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-4">Quick Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Breakdown
            label="Successful Deliveries"
            value={data.successfulDeliveries}
          />
          <Breakdown
            label="Failed Deliveries"
            value={data.totalDeliveries - data.successfulDeliveries}
          />
          <Breakdown label="Total Ratings" value={data.ratings.length} />
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mt-6">
        <h3 className="font-semibold mb-4">Rate Your Experience</h3>
        <UserRating onSubmit={handleRatingSubmit} />
      </div>
    </div>
  );
}

/* Components */
function MetricCard({ title, value, icon, progress, progressLabel, color }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="text-2xl font-bold flex items-center gap-2">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {progress && (
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progressLabel}</p>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 h-80">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Breakdown({ label, value }) {
  return (
    <div className="p-3 border rounded dark:border-gray-700">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
