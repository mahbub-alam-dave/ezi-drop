// /components/dashboard/overview/DashboardOverview.jsx
'use client';

import { DashboardProvider, useDashboard } from "@/contexts/DashboardContexts";
import ActionToolbar from "./adminOverview/ActionToolbar";
import AIinsightBanner from "./adminOverview/AIinsightBanner";
import BillingSummary from "./adminOverview/BillingSummary";
import MapAndHeatmap from "./adminOverview/MapAndHeatmap";
import MetricsGrid from "./adminOverview/MetricsGrid";
import OverviewCharts from "./adminOverview/OverviewCharts";
import OverviewFilter from "./adminOverview/OverviewFilter";
import OverviewHeader from "./adminOverview/OverviewHeader";
import RecentActivities from "./adminOverview/RecentActivities";
import ServiceAreas from "./adminOverview/ServiceAreas";
import TopCouriers from "./adminOverview/TopCouriers";
import SupportsTicket from "./supportAgent(admin)/SupportsTicket";
import TopPerformers from "./adminOverview/TopPerformers";


function DashboardContent() {
  const { loading, error } = useDashboard();
  
/*   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  } */
  
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-slate-800 dark:text-white">
      <OverviewHeader />
      <AIinsightBanner />
      <OverviewFilter />
      <MetricsGrid />
      <OverviewCharts />
      <MapAndHeatmap />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <SupportsTicket displayArea="page" />
        <BillingSummary />
        <ServiceAreas />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <RecentActivities />
        {/* <TopCouriers /> */}
        <TopPerformers />
      </div>
      
      <ActionToolbar />
    </div>
  );
}

export default function DashboardOverview({ role }) {
  return (
    <DashboardProvider role={role}>
      <DashboardContent />
    </DashboardProvider>
  );
}