"use client"
import React, { useEffect, useState } from 'react';

const RecentActivities = () => {
    const [recentActivities, setRecentActivities] = useState([]);
          const [isLoading, setIsLoading] = useState(false);
        
          useEffect(() => {
            const fetchData = async () => {
              setIsLoading(true);
              await new Promise((resolve) => setTimeout(resolve, 1500));
        
                  setRecentActivities([
        { action: 'Package delivered', time: '2 mins ago', courier: 'John D.', status: 'completed' },
        { action: 'New order received', time: '15 mins ago', courier: 'System', status: 'info' },
        { action: 'Package out for delivery', time: '45 mins ago', courier: 'Sarah M.', status: 'processing' },
        { action: 'Delivery exception', time: '1 hour ago', courier: 'Mike R.', status: 'warning' },
        { action: 'Payment received', time: '2 hours ago', courier: 'System', status: 'info' },
      ]);
              setIsLoading(false);
            };
            fetchData();
          }, []);

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
  
    return (
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
    );
};

export default RecentActivities;