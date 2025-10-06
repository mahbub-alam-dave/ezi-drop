'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SupportsTicket from '@/components/dashboardComponents/supportAgent(admin)/SupportsTicket';
import OverviewHeader from '@/components/dashboardComponents/adminOverview/OverviewHeader';
import AIinsightBanner from '@/components/dashboardComponents/adminOverview/AIinsightBanner';
import OverviewFilter from '@/components/dashboardComponents/adminOverview/OverviewFilter';
import MetricsGrid from '@/components/dashboardComponents/adminOverview/MetricsGrid';
import OverviewCharts from '@/components/dashboardComponents/adminOverview/OverviewCharts';
import MapAndHeatmap from '@/components/dashboardComponents/adminOverview/MapAndHeatmap';

const AdminOverview = () => {
  // ========== STATES ==========
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCouriers, setTopCouriers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  


  // ===== NEWLY ADDED STATES =====
  const [supportTickets, setSupportTickets] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [billingSummary, setBillingSummary] = useState({});

  // ===== LOADING & ANIMATION STATES =====
  const [isLoading, setIsLoading] = useState(true);


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

/*       setStatusData([
        { name: 'Delivered', value: 75, color: '#10B981', bg: 'bg-green-500' },
        { name: 'In Transit', value: 15, color: '#3B82F6', bg: 'bg-blue-500' },
        { name: 'Pending', value: 7, color: '#F59E0B', bg: 'bg-yellow-500' },
        { name: 'Returned', value: 3, color: '#EF4444', bg: 'bg-red-500' },
      ]); */

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
      <OverviewHeader />

      {/* ===== AI INSIGHT BANNER ===== */}
      <AIinsightBanner />

      {/* ===== FILTERS ===== */}
      <OverviewFilter />

      {/* ===== METRICS GRID ===== */}
      <MetricsGrid />

      {/* ===== CHARTS SECTION ===== */}
      <OverviewCharts />

      {/* ===== NEW FEATURE ROW: MAP + HEATMAP + SUPPORT ===== */}
      <MapAndHeatmap />

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
        <SupportsTicket displayArea={"page"} />

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