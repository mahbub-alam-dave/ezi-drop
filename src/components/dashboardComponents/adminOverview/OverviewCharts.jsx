"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const OverviewCharts = () => {

    const [deliveryData, setDeliveryData] = useState([]);

        const [statusData, setStatusData] = useState([]);

      useEffect(() => {
            const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

        setDeliveryData([
        { day: 'Mon', deliveries: 120, color: '#3B82F6' },
        { day: 'Tue', deliveries: 150, color: '#10B981' },
        { day: 'Wed', deliveries: 180, color: '#F59E0B' },
        { day: 'Thu', deliveries: 210, color: '#8B5CF6' },
        { day: 'Fri', deliveries: 240, color: '#EF4444' },
        { day: 'Sat', deliveries: 170, color: '#06B6D4' },
        { day: 'Sun', deliveries: 130, color: '#EC4899' },
      ])

      setStatusData([
        { name: 'Delivered', value: 75, color: '#10B981', bg: 'bg-green-500' },
        { name: 'In Transit', value: 15, color: '#3B82F6', bg: 'bg-blue-500' },
        { name: 'Pending', value: 7, color: '#F59E0B', bg: 'bg-yellow-500' },
        { name: 'Returned', value: 3, color: '#EF4444', bg: 'bg-red-500' },
      ])
    }
    fetchData()

      },[])

        const [chartLoaded, setChartLoaded] = useState(false);
        const [isLoading, setIsLoading] = useState(false)

          useEffect(() => {
            if (!isLoading) {
              setTimeout(() => setChartLoaded(true), 300);
            }
          }, [isLoading]);

      // ========== ANIMATED BAR CHART ==========
  const AnimatedBarChart = ({ data }) => {
    if (!data?.length) return <div className="text-slate-400 text-center py-10">No data available</div>;

    const maxDeliveries = Math.max(...data.map(d => d.deliveries));

    return (
      <div className="w-full h-72 flex items-end justify-between gap-3 mt-6 px-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={chartLoaded ? { height: `${(item.deliveries / maxDeliveries) * 100}%` } : { height: 0 }}
            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
            className="flex flex-col items-center group relative w-12 bg-gradient-to-t rounded-t-lg shadow-sm"
            style={{ backgroundColor: item.color }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.deliveries} deliveries
            </div>
            <span className="text-white text-xs mt-2 mb-1 font-medium">{item.day}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  // ========== ANIMATED PIE CHART ==========
  const AnimatedPieChart = ({ data }) => {
    if (!data?.length) return <div className="text-slate-400 text-center py-10">No data available</div>;

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
  
    return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Weekly Delivery Trends</h2>
            <select className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>This Week</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <AnimatedBarChart data={deliveryData} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Delivery Status</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">Updated 1 hour ago</span>
          </div>
          <AnimatedPieChart data={statusData} />
        </div>
      </div>
    );
};

export default OverviewCharts;