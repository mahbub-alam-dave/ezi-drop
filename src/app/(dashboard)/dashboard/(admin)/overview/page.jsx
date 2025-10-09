"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SupportsTicket from "@/components/dashboardComponents/adminOverview/supportAgent(admin)/SupportsTicket";
import OverviewHeader from "@/components/dashboardComponents/adminOverview/OverviewHeader";
import AIinsightBanner from "@/components/dashboardComponents/adminOverview/AIinsightBanner";
import OverviewFilter from "@/components/dashboardComponents/adminOverview/OverviewFilter";
import MetricsGrid from "@/components/dashboardComponents/adminOverview/MetricsGrid";
import OverviewCharts from "@/components/dashboardComponents/adminOverview/OverviewCharts";
import MapAndHeatmap from "@/components/dashboardComponents/adminOverview/MapAndHeatmap";
import BillingSummary from "@/components/dashboardComponents/adminOverview/BillingSummary";
import ServiceAreas from "@/components/dashboardComponents/adminOverview/ServiceAreas";
import RecentActivities from "@/components/dashboardComponents/adminOverview/RecentActivities";
import TopCouriers from "@/components/dashboardComponents/adminOverview/TopCouriers";
import ActionToolbar from "@/components/dashboardComponents/adminOverview/ActionToolbar";

const AdminOverview = () => {
  // ========== STATES ==========
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});

  // ===== LOADING & ANIMATION STATES =====
  const [isLoading, setIsLoading] = useState(true);

  // ========== SIMULATED DATA FETCH ==========
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAlerts([
        {
          type: "warning",
          message: "Courier #34 delayed — traffic in Zone C",
          time: "5 min ago",
        },
        {
          type: "info",
          message: "New courier onboarded: Lisa Chen",
          time: "20 min ago",
        },
        {
          type: "critical",
          message: "Warehouse scanner offline in East Hub",
          time: "1 hour ago",
        },
      ]);

      setSystemHealth({
        apiStatus: "Operational",
        serverLoad: "32%",
        activeUsers: 142,
        dbLatency: "47ms",
      });

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // ========== SKELETON LOADER ==========
  const SkeletonLoader = () => (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-5"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
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
        <BillingSummary />

        {/* 5. SERVICE AREAS */}
        <ServiceAreas />
      </div>

      {/* ===== BOTTOM GRIDS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Recent Activities */}
        <RecentActivities />
        {/* Top Couriers */}
        <TopCouriers />
      </div>

      {/* ===== STICKY QUICK ACTION TOOLBAR ===== */}
      <ActionToolbar />
    </div>
  );
};

export default AdminOverview;
