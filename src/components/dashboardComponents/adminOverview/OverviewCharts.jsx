"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContexts';

const OverviewCharts = () => {
    const { stats } = useDashboard();
    const [chartLoaded, setChartLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (stats?.weeklyDeliveries && stats?.statusData) {
        setIsLoading(false);
        setTimeout(() => setChartLoaded(true), 300);
      }
    }, [stats]);

    // ========== ANIMATED BAR CHART ==========
    const AnimatedBarChart = ({ data }) => {
      if (!data?.length) {
        return (
          <div className="text-slate-400 text-center py-10">
            No data available
          </div>
        );
      }

      const maxDeliveries = Math.max(...data.map(d => d.deliveries), 1);

      return (
        <div className="w-full h-72 flex items-end justify-between gap-3 mt-6 px-2">
          {data.map((item, index) => {
            // Calculate height: minimum 8% for zero values, otherwise scale normally
            const heightPercent = item.deliveries === 0 
              ? 8 
              : Math.max(8, (item.deliveries / maxDeliveries) * 100);
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={chartLoaded ? { height: `${heightPercent}%` } : { height: 0 }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                className={`flex flex-col items-center group relative flex-1 max-w-[80px] rounded-t-lg shadow-sm ${
                  item.deliveries === 0 ? 'opacity-30' : 'opacity-100'
                }`}
                style={{ 
                  background: item.deliveries === 0 
                    ? `linear-gradient(to top, ${item.color}40, ${item.color}60)` 
                    : `linear-gradient(to top, ${item.color}, ${item.color})`
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {item.deliveries} {item.deliveries === 1 ? 'delivery' : 'deliveries'}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">{item.day}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      );
    };

    // ========== ANIMATED PIE CHART ==========
    const AnimatedPieChart = ({ data }) => {
      if (!data?.length) {
        return (
          <div className="text-slate-400 text-center py-10">
            No data available
          </div>
        );
      }

      const total = data.reduce((sum, item) => sum + item.value, 0);
      let cumulativePercent = 0;

      return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mt-4">
          <div className="relative w-52 h-52">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percent = item.value;
                const strokeDasharray = `${percent} ${100 - percent}`;
                const rotation = cumulativePercent * 3.6;
                cumulativePercent += percent;

                return (
                  <motion.circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="15"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset="0"
                    transform={`rotate(${rotation} 50 50)`}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={chartLoaded ? { strokeDasharray } : { strokeDasharray: "0 100" }}
                    transition={{ duration: 1.5, delay: index * 0.2, ease: "easeInOut" }}
                    className="drop-shadow-sm"
                  />
                );
              })}
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-800 dark:fill-white">
                {total}%
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${item.bg}`}></div>
                <div>
                  <div className="font-medium text-slate-800 dark:text-white">{item.name}</div>
                  <div className="text-slate-500 dark:text-slate-400">{item.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    // Loading skeleton
    if (isLoading || !stats) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
              <div className="h-72 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
            </div>
          ))}
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Weekly Delivery Trends</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {stats.totalOrders?.count || 0} total orders
            </span>
          </div>
          <AnimatedBarChart data={stats.weeklyDeliveries || []} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Delivery Status</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">Current period</span>
          </div>
          <AnimatedPieChart data={stats.statusData || []} />
        </div>
      </div>
    );
};

export default OverviewCharts;