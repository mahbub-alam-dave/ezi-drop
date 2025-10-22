"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  AreaChart,
  Area,
} from "recharts";
import UserRating from "@/components/UserRating/UserRating";
import useLoadingSpinner from "@/hooks/useLoadingSpinner"; // ✅ Hook import

export default function PerformancePage() {
  const [data, setData] = useState(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Hook top-level এ কল করতে হবে
  const spinner = useLoadingSpinner("Loading performance data...");

  // 🔄 Backend থেকে ডেটা ফেচ
  useEffect(() => {
    fetch("/api/performance")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data?.length > 0) {
          setData(result.data[0]);
        } else {
          Swal.fire("Error", "Failed to load performance data", "error");
        }
      })
      .catch(() => Swal.fire("Error", "Server connection failed", "error"))
      .finally(() => setLoading(false));
  }, []);
  

  // 🔒 Loading / Empty Data হ্যান্ডেল
  if (loading) return spinner;
  if (!data) return <p className="text-center p-6">No performance data found.</p>;

  // 📈 ক্যালকুলেশন (safe)
  const successRate = useMemo(
    () =>
      ((data?.successfulDeliveries ?? 0) /
        (data?.totalDeliveries || 1)) *
      100,
    [data]
  );

  const avgRating = useMemo(() => {
    const ratings = data?.ratings ?? [];
    if (ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2);
  }, [data]);

  const pointsGoal = 5000;
  const pointsProgress = Math.min(
    100,
    Math.round(((data?.totalPoints ?? 0) / pointsGoal) * 100)
  );

  // 🎯 SweetAlert Notifications
  useEffect(() => {
    if (!ratingSubmitted && data) {
      if (data.totalPoints >= pointsGoal) {
        Swal.fire({
          title: "🎉 Congratulations!",
          text: "You’ve reached your monthly points goal!",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      } else if (successRate < 80) {
        Swal.fire({
          title: "⚠️ Low Performance",
          text: "Your success rate is below 80%. Try to improve this month!",
          icon: "warning",
          confirmButtonColor: "#f97316",
        });
      }
    }
  }, [data, ratingSubmitted, successRate]);

  // ⭐ User Rating Submit
  const handleRatingSubmit = (rating) => {
    setRatingSubmitted(true);
    Swal.fire({
      title: "Thanks for your feedback!",
      text: `You rated ${rating} stars.`,
      icon: "success",
      confirmButtonColor: "#10b981",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-8">
        Your Performance Dashboard
      </h1>

      {/* 📦 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Deliveries" value={data.totalDeliveries ?? 0} icon={<Hash size={28} />} />
        <MetricCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
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
        />
        <MetricCard
          title="Total Points"
          value={data.totalPoints ?? 0}
          icon={<Trophy size={28} />}
          progress={pointsProgress}
          progressLabel={`Goal: ${pointsGoal} pts`}
          color="from-amber-400 to-red-500"
        />
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Deliveries">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly ?? []}>
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
            <LineChart data={data.monthly ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="points" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 🧾 Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-4">Quick Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Breakdown label="Successful Deliveries" value={data.successfulDeliveries ?? 0} />
          <Breakdown label="Failed Deliveries" value={(data.totalDeliveries ?? 0) - (data.successfulDeliveries ?? 0)} />
          <Breakdown label="Total Ratings" value={data.ratings?.length ?? 0} />
        </div>
      </div>

      {/* ⭐ User Rating Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mt-6">
        <h3 className="font-semibold mb-4">Rate Your Experience</h3>
        <UserRating onSubmit={handleRatingSubmit} />
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
          <div className="text-2xl font-bold flex items-center gap-2">{value}</div>
        </div>
        {icon && <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">{icon}</div>}
      </div>
      {progress && (
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progressLabel}</p>
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
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
