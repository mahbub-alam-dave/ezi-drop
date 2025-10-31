
  /* [
        { title: 'Total Deliveries', value: '1,240', change: '+12%', icon: '📦', color: 'from-blue-500 to-blue-600' },
        { title: 'Active Couriers', value: '28', change: '+5%', icon: '🚚', color: 'from-green-500 to-green-600' },
        { title: 'Pending Orders', value: '47', change: '-3%', icon: '⏱️', color: 'from-yellow-500 to-yellow-600' },
        { title: 'Satisfaction Rate', value: '94%', change: '+2%', icon: '⭐', color: 'from-purple-500 to-purple-600' },
        { title: 'Today’s Revenue', value: '$8,420', change: '+8%', icon: '💰', color: 'from-amber-500 to-amber-600' },
        { title: 'Avg. Delivery Time', value: '38 min', change: '-4%', icon: '⏱️', color: 'from-teal-500 to-teal-600' },
      ] */
"use client"
import { useDashboard } from '@/contexts/DashboardContexts';
import React, { useMemo } from 'react';

const MetricsGrid = () => {
  const { stats } = useDashboard();

  // Memoize metrics to prevent unnecessary recalculations
  const metrics = useMemo(() => {
    if (!stats || stats === null) return [];

    return [
      {
        title: 'Total Orders',
        value: stats.totalOrders?.count ?? 0,
        trend: stats.totalOrders?.trend ?? '0%',
        icon: '📦',
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Delivered',
        value: stats.deliveredOrders?.count ?? 0,
        trend: stats.deliveredOrders?.trend ?? '0%',
        icon: '✅',
        color: 'from-green-500 to-green-600'
      },
      {
        title: 'Pending',
        value: stats.pendingOrders?.count ?? 0,
        trend: stats.pendingOrders?.trend ?? '0%',
        icon: '⏳',
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        title: 'Total Revenue',
        value: `৳${(stats.totalRevenue?.amount ?? 0).toLocaleString()}`,
        trend: stats.totalRevenue?.trend ?? '0%',
        icon: '💰',
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: 'Total Riders',
        value: stats.totalRiders?.count ?? 0,
        trend: stats.totalRiders?.trend ?? '0%',
        icon: '🏍️',
        color: 'from-amber-500 to-amber-600'
      },
      {
        title: 'Total Users',
        value: stats.totalUsers?.count ?? 0,
        trend: stats.totalUsers?.trend ?? '0%',
        icon: '👥',
        color: 'from-teal-500 to-teal-600'
      }
    ];
  }, [stats]);

  // Early return if no stats
  if (!stats || stats === null || metrics.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
              </div>
              <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
      {metrics.map((metric, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 group hover:-translate-y-1"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {metric.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {metric.value}
              </h3>
              <p className={`text-sm mt-2 flex items-center font-medium ${
                metric.trend.includes('+') ? 'text-green-600' : 
                metric.trend.includes('-') ? 'text-red-600' : 
                'text-slate-500'
              }`}>
                <span className="mr-1">
                  {metric.trend.includes('+') ? '📈' : 
                   metric.trend.includes('-') ? '📉' : '➖'}
                </span>
                {metric.trend} vs last period
              </p>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${metric.color} text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}>
              <span className="text-2xl">{metric.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;