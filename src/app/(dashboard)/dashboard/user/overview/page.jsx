"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserOverview() {
  // States
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/user-dashboard/overview');
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Failed to fetch overview data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const config = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      info: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      open: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const className = config[status] || config.info;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const SkeletonLoader = () => (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>

      {/* AI INSIGHT */}
      <div className="mb-8 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse bg-gray-200 dark:bg-gray-700 h-24"></div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mb-10">
        {[...Array(6)].map((_, i) => (
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

  // Loading state
  if (isLoading) return <SkeletonLoader />;

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Failed to Load Data</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchOverviewData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="text-6xl">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Data Available</h2>
          <p className="text-gray-600 dark:text-gray-400">Start sending parcels to see your overview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-slate-800 dark:text-white">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {data.user.name || 'User'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your deliveries and orders in real-time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Reward Points</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {data.user.points || 0} pts
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI INSIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white p-3 rounded-xl shadow-lg flex-shrink-0">
            <span className="text-xl">🤖</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
              AI-Powered Insight
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.aiInsight}
            </p>
          </div>
        </div>
      </motion.div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mb-10">
        <AnimatePresence>
          {data.metrics.map((metric, i) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {metric.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                    {metric.value}
                  </h3>
                  <p className={`text-sm mt-2 flex items-center font-medium ${
                    metric.change.includes('+') ? 'text-green-600 dark:text-green-400' : 
                    metric.change.includes('-') ? 'text-red-600 dark:text-red-400' : 
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    <span className="mr-1">
                      {metric.change.includes('+') ? '📈' : metric.change.includes('-') ? '📉' : '➖'}
                    </span>
                    {metric.change} vs last period
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${metric.color} text-white shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* RECENT ACTIVITIES & SUPPORT TICKETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Recent Activities
            </h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start pb-5 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-lg">📦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-slate-800 dark:text-white font-medium">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.trackingId}
                        </p>
                      </div>
                      <StatusBadge status={activity.status} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* SUPPORT TICKETS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              My Support Tickets
            </h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              New Ticket
            </button>
          </div>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {data.supportTickets.length > 0 ? (
              data.supportTickets.map((ticket, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex justify-between items-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow transition-shadow cursor-pointer"
                >
                  <div>
                    <p className="text-slate-800 dark:text-white font-medium">
                      {ticket.subject}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {ticket.id}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No support tickets</p>
                <p className="text-sm mt-2">Need help? Create a ticket</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* BILLING SUMMARY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm mb-10"
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
          Billing Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center border border-blue-200 dark:border-blue-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              ৳{data.billingSummary.totalSpent?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center border border-yellow-200 dark:border-yellow-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Refunds</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              ৳{data.billingSummary.refunds?.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl text-center border border-green-200 dark:border-green-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Pending Payments</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              ৳{data.billingSummary.pendingPayments?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
          <p className="text-sm text-green-700 dark:text-green-400 mb-1">Delivered</p>
          <p className="text-3xl font-bold text-green-800 dark:text-green-300">
            {data.stats.delivered}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">In Transit</p>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
            {data.stats.inTransit}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-1">Total Parcels</p>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">
            {data.stats.total}
          </p>
        </div>
      </motion.div>
    </div>
  );
}