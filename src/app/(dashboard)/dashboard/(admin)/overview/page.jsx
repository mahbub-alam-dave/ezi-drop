'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SupportsTicket from '@/components/dashboardComponents/supportAgent(admin)/SupportsTicket';

const AdminOverview = () => {
  // ========== STATES ==========
  const [metricsData, setMetricsData] = useState([
    { title: 'Total Deliveries', value: '1,240', change: '+12%', icon: '📦', color: 'from-blue-500 to-blue-600' },
    { title: 'Active Couriers', value: '28', change: '+5%', icon: '🚚', color: 'from-green-500 to-green-600' },
    { title: 'Pending Orders', value: '47', change: '-3%', icon: '⏱️', color: 'from-yellow-500 to-yellow-600' },
    { title: 'Satisfaction Rate', value: '94%', change: '+2%', icon: '⭐', color: 'from-purple-500 to-purple-600' },
    { title: 'Today’s Revenue', value: '$8,420', change: '+8%', icon: '💰', color: 'from-amber-500 to-amber-600' },
    { title: 'Avg. Delivery Time', value: '38 min', change: '-4%', icon: '⏱️', color: 'from-teal-500 to-teal-600' },
  ]);

  const [deliveryData, setDeliveryData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCouriers, setTopCouriers] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [filters, setFilters] = useState({ region: 'All', dateRange: 'Today' });
  const [aiInsight, setAiInsight] = useState("High delivery volume expected in Downtown Zone tomorrow — pre-assign 5 extra couriers.");

  // ===== NEWLY ADDED STATES =====
  const [supportTickets, setSupportTickets] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [billingSummary, setBillingSummary] = useState({});

  // ===== LOADING & ANIMATION STATES =====
  const [isLoading, setIsLoading] = useState(true);
  const [chartLoaded, setChartLoaded] = useState(false);

  // Trigger chart animation on load
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setChartLoaded(true), 300);
    }
  }, [isLoading]);

  // ========== SIMULATED DATA FETCH ==========
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
      ]);

      setRecentActivities([
        { action: 'Package delivered', time: '2 mins ago', courier: 'John D.', status: 'completed' },
        { action: 'New order received', time: '15 mins ago', courier: 'System', status: 'info' },
        { action: 'Package out for delivery', time: '45 mins ago', courier: 'Sarah M.', status: 'processing' },
        { action: 'Delivery exception', time: '1 hour ago', courier: 'Mike R.', status: 'warning' },
        { action: 'Payment received', time: '2 hours ago', courier: 'System', status: 'info' },
      ]);

      setTopCouriers([
        { id: 1, name: 'John Doe', deliveries: 48, rating: 4.9, efficiency: '98%', available: true },
        { id: 2, name: 'Sarah Miller', deliveries: 42, rating: 4.8, efficiency: '95%', available: true },
        { id: 3, name: 'Mike Ross', deliveries: 39, rating: 4.7, efficiency: '93%', available: false },
        { id: 4, name: 'Anna Johnson', deliveries: 35, rating: 4.8, efficiency: '96%', available: true },
        { id: 5, name: 'David Wilson', deliveries: 32, rating: 4.6, efficiency: '91%', available: true },
      ]);

      setStatusData([
        { name: 'Delivered', value: 75, color: '#10B981', bg: 'bg-green-500' },
        { name: 'In Transit', value: 15, color: '#3B82F6', bg: 'bg-blue-500' },
        { name: 'Pending', value: 7, color: '#F59E0B', bg: 'bg-yellow-500' },
        { name: 'Returned', value: 3, color: '#EF4444', bg: 'bg-red-500' },
      ]);

      setAlerts([
        { type: 'warning', message: 'Courier #34 delayed — traffic in Zone C', time: '5 min ago' },
        { type: 'info', message: 'New courier onboarded: Lisa Chen', time: '20 min ago' },
        { type: 'critical', message: 'Warehouse scanner offline in East Hub', time: '1 hour ago' },
      ]);

      setSystemHealth({
        apiStatus: 'Operational',
        serverLoad: '32%',
        activeUsers: 142,
        dbLatency: '47ms',
      });

      // ===== SIMULATED NEW DATA =====
      setSupportTickets([
        { id: '#TICK-205', subject: 'Late Delivery', customer: 'Jane Smith', priority: 'high', status: 'open' },
        { id: '#TICK-204', subject: 'Damaged Package', customer: 'Robert Kim', priority: 'medium', status: 'in_progress' },
        { id: '#TICK-203', subject: 'Wrong Address', customer: 'Lisa Chen', priority: 'low', status: 'resolved' },
      ]);

      setServiceAreas([
        { name: 'Downtown Core', radius: '3 km', price: '$5.99', status: 'active' },
        { name: 'Suburban North', radius: '8 km', price: '$8.99', status: 'active' },
        { name: 'Airport Zone', radius: '5 km', price: '$12.99', status: 'active' },
        { name: 'Rural West', radius: '15 km', price: '$15.99', status: 'limited' },
      ]);

      setBillingSummary({
        weeklyRevenue: 12840,
        pendingPayouts: 3210,
        unpaidInvoices: 12,
        refunds: 480,
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // ========== TOGGLE COURIER ==========
  const toggleCourierAvailability = (id) => {
    setTopCouriers(prev =>
      prev.map(courier =>
        courier.id === id ? { ...courier, available: !courier.available } : courier
      )
    );
  };

  // ========== EXPORT HANDLER ==========
  const exportData = (format) => {
    alert(`Exporting as ${format.toUpperCase()}... (simulated)`);
  };

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

  // ========== STATUS BADGE ==========
  const StatusBadge = ({ status }) => {
    const config = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-gray-100 text-gray-800',
      critical: 'bg-red-100 text-red-800',
    };
    const className = config[status] || config.info;
    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  // ========== SKELETON LOADER ==========
  const SkeletonLoader = () => (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-5"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== RENDER ==========
  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-slate-800 dark:text-white">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Courier Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time dashboard for intelligent delivery operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">Last updated: Today, 10:30 AM</span>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>🔄</span> Refresh Data
          </button>
          <div className="border-l border-slate-300 dark:border-slate-600 h-6 mx-2"></div>
          <button
            onClick={() => exportData('csv')}
            className="bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <span>📄</span> Export PDF
          </button>
        </div>
      </div>

      {/* ===== AI INSIGHT BANNER ===== */}
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

      {/* ===== FILTERS ===== */}
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

      {/* ===== METRICS GRID ===== */}
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

      {/* ===== CHARTS SECTION ===== */}
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

      {/* ===== NEW FEATURE ROW: MAP + HEATMAP + SUPPORT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* 1. LIVE MAP */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Live Courier Tracking Map</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Fullscreen</button>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl h-80 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 opacity-10">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-500" style={{ top: `${(i + 1) * 12.5}%` }}></div>
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-full w-px bg-slate-500" style={{ left: `${(i + 1) * 12.5}%` }}></div>
                  ))}
                </div>

                {[
                  { x: '25%', y: '30%', color: 'bg-blue-500', id: 'C001' },
                  { x: '65%', y: '45%', color: 'bg-green-500', id: 'C002' },
                  { x: '40%', y: '70%', color: 'bg-amber-500', id: 'C003' },
                  { x: '80%', y: '20%', color: 'bg-purple-500', id: 'C004' },
                  { x: '15%', y: '60%', color: 'bg-red-500', id: 'C005' },
                ].map((courier, idx) => (
                  <motion.div
                    key={idx}
                    className={`absolute w-4 h-4 rounded-full ${courier.color} shadow-lg cursor-pointer`}
                    style={{ left: courier.x, top: courier.y }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                    title={`Courier ${courier.id}`}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 whitespace-nowrap transition-opacity">
                      {courier.id}
                    </div>
                  </motion.div>
                ))}

                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Active Couriers: 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-center">Zone A</div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-center">Zone B</div>
            <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-center">Zone C</div>
            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-center">Zone D</div>
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-center">Zone E</div>
          </div>
        </div>

        {/* 2. DELIVERY HEATMAP */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">Delivery Heatmap</h2>
          <div className="space-y-4">
            {[
              { zone: 'Downtown', deliveries: 320, color: 'bg-red-500', trend: '+18%' },
              { zone: 'Uptown', deliveries: 210, color: 'bg-orange-500', trend: '+7%' },
              { zone: 'East Hub', deliveries: 180, color: 'bg-amber-500', trend: '-2%' },
              { zone: 'West Zone', deliveries: 140, color: 'bg-blue-500', trend: '+12%' },
              { zone: 'North Hills', deliveries: 90, color: 'bg-green-500', trend: '+5%' },
            ].map((zone, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                  <span className="font-medium">{zone.zone}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{zone.deliveries}</div>
                  <div className={`text-xs ${zone.trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {zone.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              ⚠️ Downtown zone exceeding capacity — consider adding temporary staff.
            </p>
          </div>
        </div>
      </div>

      {/* ===== NEW ROW: SUPPORT + BILLING + SERVICE AREAS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* 3. SUPPORT TICKETS */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Support Tickets</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {supportTickets.map((ticket, i) => (
              <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-800 dark:text-white">{ticket.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">{ticket.subject}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">by {ticket.customer}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <SupportsTicket supportTickets={supportTickets} />

        {/* 4. BILLING SUMMARY */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">Billing Summary</h2>
          <div className="space-y-5">
            <div className="flex justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <span className="font-medium">Revenue This Week</span>
              <span className="font-bold text-green-600 dark:text-green-400">${billingSummary.weeklyRevenue?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <span className="font-medium">Pending Payouts (Couriers)</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">${billingSummary.pendingPayouts?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <span className="font-medium">Unpaid Invoices</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{billingSummary.unpaidInvoices}</span>
            </div>
            <div className="flex justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <span className="font-medium">Refunds Processed</span>
              <span className="font-bold text-red-600 dark:text-red-400">${billingSummary.refunds?.toLocaleString()}</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow hover:shadow-lg">
            View Billing Dashboard
          </button>
        </div>

        {/* 5. SERVICE AREAS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Service Areas</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
          </div>
          <div className="space-y-4">
            {serviceAreas.map((area, i) => (
              <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 dark:text-white">{area.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    area.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {area.status}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Radius: {area.radius}</div>
                  <div>Base Price: {area.price}</div>
                  <div>Delivery Window: 9AM - 9PM</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium transition-colors">
            + Add New Service Area
          </button>
        </div>
      </div>

      {/* ===== BOTTOM GRIDS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Activities</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">View All</button>
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
                  <p className="text-slate-500 dark:text-slate-400 text-sm">By {activity.courier} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Couriers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Top Couriers</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Manage Team</button>
          </div>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {topCouriers.map((courier) => (
              <div key={courier.id} className="flex items-center justify-between pb-5 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 text-white font-bold text-lg shadow">
                    {courier.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white font-medium">{courier.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{courier.deliveries} deliveries • {courier.efficiency} efficiency</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-xs rounded-xl font-medium ${
                    courier.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {courier.available ? '🟢 Online' : '🔴 Offline'}
                  </span>
                  <button
                    onClick={() => toggleCourierAvailability(courier.id)}
                    className="w-8 h-8 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center text-xs transition-colors"
                  >
                    {courier.available ? '⏸️' : '▶️'}
                  </button>
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1">
                    ⭐ {courier.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STICKY QUICK ACTION TOOLBAR ===== */}
      <div className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Quick Actions</h3>
        <div className="flex flex-col gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            ➕ Assign Courier
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            🔄 Reroute Delivery
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            📩 Notify Customers
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            🚨 Create Alert
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            💰 Process Payout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;