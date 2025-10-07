"use client";

import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Star,
  CheckCircle,
  Trophy,
  Hash,
} from "lucide-react";
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
// import useLoadingSpinner from "@/hooks/useLoadingSpinner";

export default function PerformancePage() {
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  
  // const [data, setData] = useState(null);

  // // 🔄 Backend থেকে ডেটা ফেচ
  // useEffect(() => {
  //   fetch("/api/performance")
  //     .then((res) => res.json())
  //     .then((result) => {
  //       if (result.success) {
  //         setData(result.data[0]); 
  //       }
  //     });
  // }, []);
  // if (!data) return useLoadingSpinner;

  // // 📈 ক্যালকুলেশন
  // const successRate = useMemo(() => {
  //   return ((data.successfulDeliveries / data.totalDeliveries) * 100).toFixed(1);
  // }, [data]);

  // const avgRating = useMemo(() => {
  //   const sum = data.ratings.reduce((s, r) => s + r, 0);
  //   return (sum / data.ratings.length).toFixed(2);
  // }, [data]);

  // const pointsGoal = 5000;
  // const pointsProgress = Math.min(
  //   100,
  //   Math.round((data.totalPoints / pointsGoal) * 100)
  // );


  // 📊 ডেমো ডেটা (পরে API ফেচ করতে পারবেন)
  const data = {
    totalDeliveries: 1240,
    successfulDeliveries: 1168,
    ratings: [5, 4, 5, 4, 5, 3, 5, 4],
    totalPoints: 4980,
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
    recentDaily: [
      { date: "Oct 01", deliveries: 20, success: 18, points: 60, rating: 4.8 },
      { date: "Oct 02", deliveries: 22, success: 21, points: 65, rating: 4.9 },
      { date: "Oct 03", deliveries: 25, success: 23, points: 70, rating: 5.0 },
      { date: "Oct 04", deliveries: 19, success: 16, points: 55, rating: 4.5 },
      { date: "Oct 05", deliveries: 26, success: 25, points: 80, rating: 5.0 },
      { date: "Oct 06", deliveries: 24, success: 22, points: 68, rating: 4.7 },
    ],
  };

  // 📈 ক্যালকুলেশন
  const successRate = useMemo(
    () => ((data.successfulDeliveries / data.totalDeliveries) * 100).toFixed(1),
    [data.totalDeliveries, data.successfulDeliveries]
  );

  const avgRating = useMemo(() => {
    const sum = data.ratings.reduce((s, r) => s + r, 0);
    return (sum / data.ratings.length).toFixed(2);
  }, [data.ratings]);

  const pointsGoal = 5000;
  const pointsProgress = Math.min(
    100,
    Math.round((data.totalPoints / pointsGoal) * 100)
  );

  // 🎯 Goal অর্জন হলে SweetAlert
  if (data.totalPoints >= pointsGoal && !ratingSubmitted) {
    Swal.fire({
      title: "🎉 Congratulations!",
      text: "You’ve reached your monthly points goal!",
      icon: "success",
      confirmButtonColor: "#3b82f6",
    });
  }

  
  // ⚠️ Low performance হলে warning
  if (successRate < 80 && !ratingSubmitted) {
    Swal.fire({
      title: "⚠️ Low Performance",
      text: "Your success rate is below 80%. Try to improve this month!",
      icon: "warning",
      confirmButtonColor: "#f97316",
    });
  }

  // ⭐ User Rating সাবমিট হলে success alert
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
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="points" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
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

      {/* 🕒 Recent Daily Stats Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-4">Recent Daily Stats</h3>

        {/* Area Chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.recentDaily}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="points" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPoints)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-600">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Deliveries</th>
                <th className="p-2">Success</th>
                <th className="p-2">Points</th>
                <th className="p-2">Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.recentDaily.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">{row.deliveries}</td>
                  <td className="p-2">{row.success}</td>
                  <td className="p-2">{row.points}</td>
                  <td className="p-2">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
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