"use client"
import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContexts';
import AddDistrictModal from './AddDistrictModal';

const ServiceAreas = () => {
  const { role } = useDashboard();
  const [serviceAreas, setServiceAreas] = useState([]);
  const [areaType, setAreaType] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServiceAreas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard/service-areas');
      const data = await res.json();
      
      if (data.data) {
        setServiceAreas(data.data);
        setAreaType(data.type);
        setDistrictName(data.districtName || '');
      }
    } catch (error) {
      console.error('Failed to fetch service areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  const handleModalSuccess = () => {
    // Refresh the service areas list
    fetchServiceAreas();
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      limited: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
    };
    return styles[status] || styles.inactive;
  };

  const formatDate = (date) => {
    if (!date) return 'No activity';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-5"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Service Areas
            </h2>
            {districtName && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {districtName}
              </p>
            )}
          </div>
          <button className="text-sm text-blue-600 hover:underline font-medium">
            Manage
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {serviceAreas.length > 0 ? (
            serviceAreas.map((area, i) => (
              <div 
                key={i} 
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                      {area.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {areaType === 'districts' ? 'District' : 'Upazila'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(area.status)}`}>
                    {area.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">📦</span>
                    <span>{area.totalOrders} orders</span>
                  </div>
                  
                  {areaType === 'districts' && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600 dark:text-purple-400">📍</span>
                      <span>{area.upazilasCount} upazilas</span>
                    </div>
                  )}

                  {areaType === 'upazilas' && area.lastActivity && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">🕐</span>
                      <span className="text-xs">{formatDate(area.lastActivity)}</span>
                    </div>
                  )}
                </div>

                {/* Placeholder for future features */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      💰 <span className="line-through">Custom pricing</span>
                    </span>
                    <span className="flex items-center gap-1">
                      📏 <span className="line-through">Service radius</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                    Coming soon
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              No service areas found
            </div>
          )}
        </div>

        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-6 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium transition-colors"
          >
            + Add New District
          </button>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            💡 <strong>Coming Soon:</strong> Set custom pricing and service radius for each area
          </p>
        </div>
      </div>

      {/* Add District Modal */}
      <AddDistrictModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default ServiceAreas;