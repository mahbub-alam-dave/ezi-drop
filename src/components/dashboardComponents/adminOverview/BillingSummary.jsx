"use client"
import React from "react";
import { useDashboard } from '@/contexts/DashboardContexts';

const BillingSummary = () => {
  const { stats } = useDashboard();

  const billing = stats?.billing || {
    weeklyRevenue: 0,
    pendingPayouts: 0,
    unpaidInvoices: { count: 0, amount: 0 },
    refunds: 0
  };

  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-5"></div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl"></div>
          ))}
        </div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mt-6"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">
        Billing Summary
      </h2>
      <div className="space-y-5">
        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:shadow-md transition-shadow">
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Revenue This Period
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              From delivered orders
            </div>
          </div>
          <span className="font-bold text-green-600 dark:text-green-400 text-xl">
            ৳{billing.weeklyRevenue?.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-md transition-shadow">
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Pending Payouts
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Orders in transit
            </div>
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">
            ৳{billing.pendingPayouts?.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:shadow-md transition-shadow">
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Unpaid Invoices
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {billing.unpaidInvoices.count} pending payments
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-amber-600 dark:text-amber-400 text-xl">
              {billing.unpaidInvoices.count}
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-500 font-semibold">
              ৳{billing.unpaidInvoices.amount?.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:shadow-md transition-shadow">
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Cancelled Orders
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total refund amount
            </div>
          </div>
          <span className="font-bold text-red-600 dark:text-red-400 text-xl">
            ৳{billing.refunds?.toLocaleString()}
          </span>
        </div>
      </div>

      <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow hover:shadow-lg">
        View Detailed Billing
      </button>
    </div>
  );
};

export default BillingSummary;