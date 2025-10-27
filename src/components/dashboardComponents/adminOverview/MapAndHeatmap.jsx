"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContexts';


const MapAndHeatmap = () => {
  const { role, dateRange, selectedDistrict } = useDashboard();
  const [geoData, setGeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGeoData = async () => {
      if (!dateRange) return;
      
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        const res = await fetch(`/api/dashboard/maps?${params}`);
        const data = await res.json();
        setGeoData(data);
      } catch (error) {
        console.error('Failed to fetch geographic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeoData();
  }, [dateRange, selectedDistrict]);

  // Color scale based on delivery count
  const getHeatColor = (count, maxCount) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return { bg: 'bg-red-500', ring: 'ring-red-500' };
    if (intensity > 0.6) return { bg: 'bg-orange-500', ring: 'ring-orange-500' };
    if (intensity > 0.4) return { bg: 'bg-amber-500', ring: 'ring-amber-500' };
    if (intensity > 0.2) return { bg: 'bg-blue-500', ring: 'ring-blue-500' };
    return { bg: 'bg-green-500', ring: 'ring-green-500' };
  };

  const getLocationTypeLabel = () => {
    if (!geoData) return '';
    if (geoData.type === 'districts') return 'District';
    if (geoData.type === 'upazilas') return 'Upazila';
    return 'Location';
  };

  if (isLoading || !geoData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {[1, 2].map((i) => (
          <div key={i} className={`bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm ${i === 1 ? 'col-span-1 lg:col-span-2' : ''} animate-pulse`}>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
            <div className="h-80 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const maxOrders = Math.max(...(geoData.data?.map(d => d.totalOrders) || [1]), 1);
  const topLocations = geoData.data?.slice(0, 5) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      {/* Geographic Distribution Map */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {getLocationTypeLabel()}-wise Distribution
            {geoData.districtName && (
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                ({geoData.districtName})
              </span>
            )}
          </h2>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {geoData.type === 'districts' 
              ? `${geoData.activeDistricts}/${geoData.totalDistricts} Active Districts`
              : `${geoData.totalUpazilas} Upazilas`}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl h-80 relative overflow-hidden p-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div key={`h-${i}`} className="w-full h-px bg-slate-500" style={{ top: `${(i + 1) * 12.5}%` }}></div>
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={`v-${i}`} className="h-full w-px bg-slate-500" style={{ left: `${(i + 1) * 12.5}%` }}></div>
                ))}
              </div>

              {/* Distribution Points */}
              <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-4 p-4 overflow-auto">
                {geoData.data?.length > 0 ? (
                  geoData.data.map((location, idx) => {
                    const colors = getHeatColor(location.totalOrders, maxOrders);
                    const size = Math.max(40, Math.min(100, (location.totalOrders / maxOrders) * 100));

                    return (
                      <motion.div
                        key={idx}
                        className={`relative rounded-xl ${colors.bg} bg-opacity-90 shadow-lg cursor-pointer p-3 group`}
                        style={{ 
                          minWidth: `${size}px`,
                          minHeight: `${size}px`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        <div className="text-white text-center">
                          <div className="font-bold text-xs truncate">{location.name}</div>
                          <div className="text-lg font-bold">{location.totalOrders}</div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 w-48">
                          <div className="font-bold mb-1">{location.name}</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-semibold">{location.totalOrders}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                              <span>Delivered:</span>
                              <span className="font-semibold">{location.delivered}</span>
                            </div>
                            <div className="flex justify-between text-yellow-400">
                              <span>Pending:</span>
                              <span className="font-semibold">{location.pending}</span>
                            </div>
                            <div className="flex justify-between text-blue-400">
                              <span>In Transit:</span>
                              <span className="font-semibold">{location.inTransit}</span>
                            </div>
                            <div className="flex justify-between text-purple-400">
                              <span>Success Rate:</span>
                              <span className="font-semibold">{location.deliveryRate}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Pulse animation for high activity */}
                        {location.totalOrders > maxOrders * 0.7 && (
                          <span className={`absolute inset-0 rounded-xl ${colors.bg} animate-ping opacity-20`}></span>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-slate-400 text-center">
                    No data available for this period
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow text-xs space-y-1">
                <div className="font-semibold mb-2">Activity Level</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Very High (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>High (60-80%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Medium (40-60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Low (20-40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Very Low (&lt;20%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Locations Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">
          Top {getLocationTypeLabel()}s
        </h2>
        <div className="space-y-4">
          {topLocations.length > 0 ? (
            topLocations.map((location, i) => {
              const colors = getHeatColor(location.totalOrders, maxOrders);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold text-sm`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800 dark:text-white">
                          {location.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Success Rate: {location.deliveryRate}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800 dark:text-white">
                        {location.totalOrders}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        ৳{location.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${colors.bg}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(location.totalOrders / maxOrders) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-slate-400 py-8">
              No data available for this period
            </div>
          )}
        </div>

        {/* Alert for high-performing location */}
        {topLocations[0] && topLocations[0].totalOrders > maxOrders * 0.7 && (
          <div className="mt-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              ⚠️ <strong>{topLocations[0].name}</strong> showing high activity — monitor capacity and consider resource allocation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapAndHeatmap;