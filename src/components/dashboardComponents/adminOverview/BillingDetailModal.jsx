"use client"
import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Package, Clock, XCircle, DollarSign } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContexts';

const BillingDetailsModal = ({ isOpen, onClose }) => {
  const { dateRange, selectedDistrict } = useDashboard();
  const [billingData, setBillingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && dateRange) {
      fetchBillingDetails();
    }
  }, [isOpen, dateRange, selectedDistrict]);

  const fetchBillingDetails = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      if (selectedDistrict && selectedDistrict !== 'all') {
        params.append('districtId', selectedDistrict);
      }

      const res = await fetch(`/api/dashboard/billing-details?${params}`);
      const result = await res.json();

      if (result.success) {
        setBillingData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch billing details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return colors[status] || 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Detailed Billing Report
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {dateRange && `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading billing details...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && billingData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-900/30">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Delivered</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      ৳{billingData.totals.delivered.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{billingData.totals.delivered.count} orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      ৳{billingData.totals.pending.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{billingData.totals.pending.count} orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Package className="text-amber-600 dark:text-amber-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Unpaid</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      ৳{billingData.totals.unpaid.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{billingData.totals.unpaid.count} orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <XCircle className="text-red-600 dark:text-red-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Cancelled</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      ৳{billingData.totals.cancelled.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{billingData.totals.cancelled.count} orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700 px-6">
              <div className="flex gap-6">
                {['overview', 'delivered', 'pending', 'unpaid', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Revenue by District */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                      Revenue by District
                    </h3>
                    <div className="space-y-2">
                      {billingData.revenueByDistrict.map((district, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-white">
                                {district._id || 'Unknown'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {district.count} orders
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-green-600 dark:text-green-400">
                            ৳{district.revenue.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Revenue Trend */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                      Daily Revenue Trend
                    </h3>
                    <div className="space-y-2">
                      {billingData.dailyRevenue.slice(-7).map((day, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white">
                              {formatDate(day._id)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {day.count} orders
                            </p>
                          </div>
                          <p className="font-bold text-blue-600 dark:text-blue-400">
                            ৳{day.revenue.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Order Lists */}
              {['delivered', 'pending', 'unpaid', 'cancelled'].map((tabName) => (
                activeTab === tabName && (
                  <div key={tabName} className="space-y-3">
                    {billingData[`${tabName}Orders`]?.length > 0 ? (
                      billingData[`${tabName}Orders`].map((order, idx) => (
                        <div
                          key={idx}
                          className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {order.parcelId}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {order.senderName} → {order.receiverName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-slate-800 dark:text-white">
                                ৳{order.amount}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <span>📍 {order.pickupDistrict}</span>
                            <span>📅 {formatDate(order.createdAt)}</span>
                            <span className={order.payment === 'done' ? 'text-green-600' : 'text-amber-600'}>
                              💳 {order.payment || 'pending'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        No {tabName} orders found
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Print Report
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingDetailsModal;