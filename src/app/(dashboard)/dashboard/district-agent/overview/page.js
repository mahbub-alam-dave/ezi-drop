import ActionToolbar from "@/components/dashboardComponents/adminOverview/ActionToolbar";
import AIinsightBanner from "@/components/dashboardComponents/adminOverview/AIinsightBanner";
import BillingSummary from "@/components/dashboardComponents/adminOverview/BillingSummary";
import MapAndHeatmap from "@/components/dashboardComponents/adminOverview/MapAndHeatmap";
import MetricsGrid from "@/components/dashboardComponents/adminOverview/MetricsGrid";
import OverviewCharts from "@/components/dashboardComponents/adminOverview/OverviewCharts";
import OverviewFilter from "@/components/dashboardComponents/adminOverview/OverviewFilter";
import OverviewHeader from "@/components/dashboardComponents/adminOverview/OverviewHeader";
import RecentActivities from "@/components/dashboardComponents/adminOverview/RecentActivities";
import ServiceAreas from "@/components/dashboardComponents/adminOverview/ServiceAreas";
import SupportsTicket from "@/components/dashboardComponents/adminOverview/supportAgent(admin)/SupportsTicket";
import TopCouriers from "@/components/dashboardComponents/adminOverview/TopCouriers";
import React from "react";

const DistrictAgentOverview = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-slate-800 dark:text-white">
      {/* header */}
      <OverviewHeader />
      {/* ai insight section */}
      <AIinsightBanner />
      {/* filter component */}
      <OverviewFilter />
      {/* metrics grid */}
      <MetricsGrid />
      {/* Charts */}
      <OverviewCharts />
      {/* ===== NEW FEATURE ROW: MAP + HEATMAP + SUPPORT ===== */}
      <MapAndHeatmap />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <SupportsTicket displayArea={"page"} />
        <BillingSummary />
        <ServiceAreas />
      </div>
      {/* ===== BOTTOM GRIDS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <RecentActivities />
        <TopCouriers />
      </div>
      <ActionToolbar />
    </div>
  );
};

export default DistrictAgentOverview;
