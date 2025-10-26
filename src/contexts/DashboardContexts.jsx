// /context/DashboardContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const DashboardContext = createContext();

export function DashboardProvider({ children, role }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });
  
  // Data states
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topCouriers, setTopCouriers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const districtParam = role === 'district_admin' 
        ? session?.user?.districtId 
        : selectedDistrict;
      
      const params = new URLSearchParams({
        districtId: districtParam || 'all',
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      
      // Fetch all data in parallel
      const [statsRes, chartsRes, couriersRes, activitiesRes] = await Promise.all([
        fetch(`/api/dashboard/stats?${params}`),
        // fetch(`/api/dashboard/charts?${params}`),
        // fetch(`/api/dashboard/top-couriers?${params}`),
        // fetch(`/api/dashboard/recent-activities?${params}`)
      ]);
      
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      
      const [statsData, chartsData, couriersData, activitiesData] = await Promise.all([
        statsRes.json(),
        // chartsRes.json(),
        // couriersRes.json(),
        // activitiesRes.json()
      ]);
      
      setStats(statsData);
      console.log(stats)
    //   setChartData(chartsData);
    //   setTopCouriers(couriersData);
    //   setRecentActivities(activitiesData);
      
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on mount and when filters change
  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [selectedDistrict, dateRange, session]);
  
  const value = {
    // State
    loading,
    error,
    stats,
    chartData,
    topCouriers,
    recentActivities,
    selectedDistrict,
    dateRange,
    role,
    
    // Actions
    setSelectedDistrict,
    setDateRange,
    refreshData: fetchDashboardData
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}