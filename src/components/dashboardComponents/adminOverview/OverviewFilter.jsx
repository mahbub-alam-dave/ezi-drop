"use client"
import React, { useState } from 'react';

const OverviewFilter = () => {
    const [filters, setFilters] = useState({ region: 'All', dateRange: 'Today' });
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-8 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Region:</label>
          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="text-sm border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>All Regions</option>
            <option>Downtown</option>
            <option>Uptown</option>
            <option>East Hub</option>
            <option>West Zone</option>
          </select>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-4">Date Range:</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="text-sm border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          <button className="ml-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow hover:shadow-lg">
            Apply Filters
          </button>
        </div>
      </div>
    );
};

export default OverviewFilter;