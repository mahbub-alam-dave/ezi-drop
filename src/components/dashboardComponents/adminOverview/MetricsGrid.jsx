"use client"
import React, { useState } from 'react';

const MetricsGrid = () => {
      const [metricsData, setMetricsData] = useState([
        { title: 'Total Deliveries', value: '1,240', change: '+12%', icon: '📦', color: 'from-blue-500 to-blue-600' },
        { title: 'Active Couriers', value: '28', change: '+5%', icon: '🚚', color: 'from-green-500 to-green-600' },
        { title: 'Pending Orders', value: '47', change: '-3%', icon: '⏱️', color: 'from-yellow-500 to-yellow-600' },
        { title: 'Satisfaction Rate', value: '94%', change: '+2%', icon: '⭐', color: 'from-purple-500 to-purple-600' },
        { title: 'Today’s Revenue', value: '$8,420', change: '+8%', icon: '💰', color: 'from-amber-500 to-amber-600' },
        { title: 'Avg. Delivery Time', value: '38 min', change: '-4%', icon: '⏱️', color: 'from-teal-500 to-teal-600' },
      ]);


    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
        {metricsData.map((metric, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 group hover:-translate-y-1"
          >
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
    );
};

export default MetricsGrid;