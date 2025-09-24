'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const useroverview = () => {
  // ===== STATES =====
  const [metricsData, setMetricsData] = useState([
  { title: 'My Deliveries', value: '32', change: '+5%', icon: '📦', color: 'from-blue-500 to-blue-600' },
  { title: 'Pending Orders', value: '4', change: '-1%', icon: '⏱️', color: 'from-yellow-500 to-yellow-600' },
  { title: 'Satisfaction Rate', value: '97%', change: '+1%', icon: '⭐', color: 'from-purple-500 to-purple-600' },
  { title: 'Current Balance', value: '$420', change: '+10%', icon: '💰', color: 'from-amber-500 to-amber-600' },
  { title: 'Scheduled Pickups', value: '5', change: '+2%', icon: '🛻', color: 'from-teal-500 to-teal-600' },
  { title: 'Completed Payments', value: '28', change: '+8%', icon: '✅', color: 'from-green-500 to-green-600' },
]);

  const [recentActivities, setRecentActivities] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [billingSummary, setBillingSummary] = useState({});
  const [aiInsight, setAiInsight] = useState("Your next delivery window is busy — consider scheduling early pickup.");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 1200));

      setRecentActivities([
        { action: 'Delivery Completed', time: '2 hours ago', status: 'completed' },
        { action: 'Order Shipped', time: '1 day ago', status: 'processing' },
        { action: 'Payment Received', time: '2 days ago', status: 'info' },
      ]);

      setSupportTickets([
        { id: '#TICK-301', subject: 'Late Package', status: 'open' },
        { id: '#TICK-300', subject: 'Wrong Item Delivered', status: 'resolved' },
      ]);

      setBillingSummary({
        totalSpent: 1240,
        refunds: 60,
        pendingPayments: 80,
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const StatusBadge = ({ status }) => {
    const config = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      info: 'bg-gray-100 text-gray-800',
      warning: 'bg-yellow-100 text-yellow-800',
      open: 'bg-red-100 text-red-800',
      resolved: 'bg-green-100 text-green-800',
    };
    const className = config[status] || config.info;
    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>{status.replace('_', ' ')}</span>;
  };

   const SkeletonLoader = () => (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>

      {/* AI INSIGHT */}
      <div className="mb-8 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse bg-gray-200 dark:bg-gray-700 h-24"></div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mb-10">
        {[...Array(metricsData.length)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse h-36"></div>
        ))}
      </div>

      {/* RECENT ACTIVITIES & SUPPORT TICKETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="p-7 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse h-96"></div>
        <div className="p-7 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse h-96"></div>
      </div>

      {/* BILLING SUMMARY */}
      <div className="p-7 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-gray-200 dark:bg-gray-700 h-28"></div>
          <div className="p-5 rounded-xl bg-gray-200 dark:bg-gray-700 h-28"></div>
          <div className="p-5 rounded-xl bg-gray-200 dark:bg-gray-700 h-28"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-slate-800 dark:text-white">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your deliveries and orders in real-time</p>
        </div>
      </div>

      {/* AI INSIGHT */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white p-3 rounded-xl shadow-lg">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">AI-Powered Insight</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiInsight}</p>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mb-10">
        {metricsData.map((metric, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 group hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{metric.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{metric.value}</h3>
                <p className={`text-sm mt-2 flex items-center font-medium ${metric.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-1">{metric.change.includes('+') ? '📈' : '📉'}</span>
                  {metric.change} vs last period
                </p>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${metric.color} text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                <span className="text-2xl">{metric.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Activities</h2>
          </div>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start pb-5 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl mr-4 flex-shrink-0">
                  <span className="text-blue-600 text-lg">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-slate-800 dark:text-white font-medium">{activity.action}</p>
                    <StatusBadge status={activity.status} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUPPORT TICKETS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Support Tickets</h2>
          </div>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {supportTickets.map((ticket, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow transition-shadow cursor-pointer">
                <div>
                  <p className="text-slate-800 dark:text-white font-medium">{ticket.subject}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{ticket.id}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BILLING SUMMARY */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm mb-10">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Billing Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">${billingSummary.totalSpent}</p>
          </div>
          <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Refunds</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">${billingSummary.refunds}</p>
          </div>
          <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Payments</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">${billingSummary.pendingPayments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default useroverview;
