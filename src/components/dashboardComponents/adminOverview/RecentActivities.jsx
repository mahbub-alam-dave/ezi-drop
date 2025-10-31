import { useEffect, useState } from 'react';
import { X, ExternalLink, Package, Clock } from 'lucide-react';

const RecentActivities = ({ districtId = 'all' }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allActivities, setAllActivities] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, skip: 0, limit: 5 });

  // Fetch initial activities (5 items)
  useEffect(() => {
    fetchActivities(5, 0);
  }, [districtId]);

  const fetchActivities = async (limit = 5, skip = 0) => {
    try {
      setIsLoading(skip === 0);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString()
      });
      
      if (districtId && districtId !== 'all') {
        params.append('districtId', districtId);
      }
      
      const res = await fetch(`/api/dashboard/recent-activities?${params}`);
      const result = await res.json();
      
      if (result.success) {
        if (skip === 0) {
          setActivities(result.data.activities);
        }
        setHasMore(result.data.pagination.hasMore);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all activities for modal
  const loadAllActivities = async () => {
    try {
      setShowModal(true);
      setLoadingMore(true);
      
      const params = new URLSearchParams({
        limit: '50', // Load more for modal
        skip: '0'
      });
      
      if (districtId && districtId !== 'all') {
        params.append('districtId', districtId);
      }
      
      const res = await fetch(`/api/dashboard/recent-activities?${params}`);
      const result = await res.json();
      
      if (result.success) {
        setAllActivities(result.data.activities);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load all activities:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Load more activities (pagination in modal)
  const loadMoreInModal = async () => {
    try {
      setLoadingMore(true);
      
      const newSkip = allActivities.length;
      const params = new URLSearchParams({
        limit: '20',
        skip: newSkip.toString()
      });
      
      if (districtId && districtId !== 'all') {
        params.append('districtId', districtId);
      }
      
      const res = await fetch(`/api/dashboard/activities?${params}`);
      const result = await res.json();
      
      if (result.success) {
        setAllActivities([...allActivities, ...result.data.activities]);
        setHasMore(result.data.pagination.hasMore);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load more activities:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const config = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      info: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const className = config[status] || config.info;
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Activity Item Component
  const ActivityItem = ({ activity, showDetails = false }) => (
    <div className="flex items-start pb-5 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl mr-4 flex-shrink-0">
        <Package className="text-blue-600 dark:text-blue-400" size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1">
            <p className="text-slate-800 dark:text-white font-medium">
              {activity.action}
            </p>
            {showDetails && activity.trackingId && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activity.trackingId}
              </p>
            )}
          </div>
          <StatusBadge status={activity.status} />
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <span>By {activity.courier}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {activity.time}
          </span>
          {showDetails && activity.district && (
            <>
              <span>•</span>
              <span>{activity.district}</span>
            </>
          )}
        </div>
        {showDetails && activity.details && (
          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 dark:text-slate-400">From:</span>
                <span className="ml-1 text-slate-700 dark:text-slate-300">
                  {activity.details.senderName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">To:</span>
                <span className="ml-1 text-slate-700 dark:text-slate-300">
                  {activity.details.receiverName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Amount:</span>
                <span className="ml-1 text-slate-700 dark:text-slate-300">
                  ৳{activity.details.amount}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="ml-1 text-slate-700 dark:text-slate-300">
                  {activity.details.currentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
        <div className="space-y-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start pb-5 border-b border-slate-200 dark:border-slate-700">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-xl mr-4 animate-pulse w-12 h-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Component */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Recent Activities
          </h2>
          <button
            onClick={loadAllActivities}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
          >
            View All
            <ExternalLink size={14} />
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  All Recent Activities
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Total: {pagination.total} activities
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingMore && allActivities.length === 0 ? (
                <div className="space-y-5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-start pb-5 border-b border-slate-200 dark:border-slate-700">
                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-xl mr-4 animate-pulse w-12 h-12"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : allActivities.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Package size={64} className="mx-auto mb-4 opacity-30" />
                  <p>No activities found</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {allActivities.map((activity) => (
                    <ActivityItem 
                      key={activity.id} 
                      activity={activity} 
                      showDetails={true}
                    />
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={loadMoreInModal}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentActivities;