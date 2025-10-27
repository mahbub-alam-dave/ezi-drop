/* "use client"
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

export default OverviewFilter; */

// /components/dashboard/overview/OverviewFilter.jsx
'use client';

import { useDashboard } from '@/contexts/DashboardContexts';
import { useState, useEffect } from 'react';

export default function OverviewFilter() {
  const { role, selectedDistrict, setSelectedDistrict, dateRange, setDateRange } = useDashboard();
  const [districts, setDistricts] = useState([]);
  
  // Local state for form inputs
  const [localDistrict, setLocalDistrict] = useState('all');
  const [localDateRange, setLocalDateRange] = useState('7days');
  
  // Track if filter has been applied
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    if (role === 'admin') {
      const fetchDistricts = async () => {
        try {
          const res = await fetch("/api/districts");
          const data = await res.json();
          if (data.success) setDistricts(data.data);
        } catch (error) {
          console.error("Failed to load districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [role]);

  // Initialize with default date range on mount
  useEffect(() => {
    if (!dateRange) {
      handleDateRangeCalculation('7days');
    }
  }, []);
  
  const handleDateRangeCalculation = (range) => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch(range) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  const handleApplyFilter = () => {
    setSelectedDistrict(localDistrict);
    setDateRange(handleDateRangeCalculation(localDateRange));
    setIsFilterApplied(true);
  };

  const handleResetFilter = () => {
    setLocalDistrict('all');
    setLocalDateRange('7days');
    setSelectedDistrict('all');
    setDateRange(handleDateRangeCalculation('7days'));
    setIsFilterApplied(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* District Filter - Only for main admin */}
          {role === 'admin' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                District
              </label>
              <select
                value={localDistrict}
                onChange={(e) => setLocalDistrict(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Districts</option>
                {districts.map((district) => (
                  <option key={district.districtId} value={district.districtId}>
                    {district.district}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Date Range Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Date Range
            </label>
            <select
              value={localDateRange}
              onChange={(e) => setLocalDateRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-3">
          <button
            onClick={handleApplyFilter}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <span>🔍</span>
            Apply Filter
          </button>
          
          {isFilterApplied && (
            <button
              onClick={handleResetFilter}
              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <span>↺</span>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
