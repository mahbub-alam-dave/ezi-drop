import AIinsightBanner from '@/components/dashboardComponents/adminOverview/AIinsightBanner';
import MapAndHeatmap from '@/components/dashboardComponents/adminOverview/MapAndHeatmap';
import MetricsGrid from '@/components/dashboardComponents/adminOverview/MetricsGrid';
import OverviewCharts from '@/components/dashboardComponents/adminOverview/OverviewCharts';
import OverviewFilter from '@/components/dashboardComponents/adminOverview/OverviewFilter';
import OverviewHeader from '@/components/dashboardComponents/adminOverview/OverviewHeader';
import React from 'react';

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
        </div>
    );
};

export default DistrictAgentOverview;