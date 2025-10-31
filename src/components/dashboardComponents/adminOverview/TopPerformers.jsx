"use client"
import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContexts';
import { useRouter } from 'next/navigation';

const TopPerformers = () => {
  const { role } = useDashboard();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [profileType, setProfileType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard/profiles');
      const data = await res.json();

      if (data.success) {
        setProfiles(data.data);
        setProfileType(data.type);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = () => {
    if (role === 'admin') {
      router.push('/dashboard/district-admins');
    } else if (role === 'district_admin') {
      router.push('/dashboard/riders');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradientColor = (index) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600',
      'from-cyan-500 to-blue-600',
      'from-violet-500 to-purple-600',
      'from-emerald-500 to-green-600',
      'from-amber-500 to-yellow-600'
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-6"></div>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {profileType === 'district_admins' ? 'District Admins' : 'Top Riders'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {profileType === 'district_admins' 
              ? 'Performance by district' 
              : 'Highest performing delivery riders'}
          </p>
        </div>
        <button 
          onClick={handleViewAll}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View All
        </button>
      </div>

      <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
        {profiles.length > 0 ? (
          profiles.map((profile, index) => (
            <div 
              key={profile.id} 
              className="flex items-center justify-between pb-5 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center flex-1">
                {/* Avatar with ranking badge */}
                <div className="relative mr-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getGradientColor(index)} flex items-center justify-center text-white font-bold text-lg shadow`}>
                    {getInitials(profile.name)}
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold shadow">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-800 dark:text-white font-medium truncate">
                      {profile.name}
                    </p>
                    {!profile.isActive && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  {profileType === 'district_admins' ? (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      📍 {profile.district} • {profile.totalOrders} orders • {profile.deliveryRate} success
                    </p>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      🚚 {profile.delivered} delivered • {profile.pending} pending • {profile.successRate} success
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Badge */}
              <div className="flex items-center gap-3 ml-4">
                {profileType === 'riders' && (
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1 shadow">
                    ⭐ {profile.rating}
                  </div>
                )}
                
                {profileType === 'district_admins' && (
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow">
                    {profile.deliveredOrders}
                  </div>
                )}

                <span className={`px-3 py-1.5 text-xs rounded-xl font-medium ${
                  profile.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400'
                }`}>
                  {profile.isActive ? '🟢 Active' : '⚪ Inactive'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg mb-2">No profiles found</p>
            <p className="text-sm">
              {profileType === 'district_admins' 
                ? 'No district admins have been added yet' 
                : 'No riders in your district yet'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {profiles.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Active</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {profiles.filter(p => p.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {profileType === 'district_admins' ? 'Total Orders' : 'Total Delivered'}
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {profileType === 'district_admins' 
                  ? profiles.reduce((sum, p) => sum + p.totalOrders, 0)
                  : profiles.reduce((sum, p) => sum + p.delivered, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPerformers;