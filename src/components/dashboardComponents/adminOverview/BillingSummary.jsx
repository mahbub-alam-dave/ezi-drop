"use client"
import React, { useEffect, useState } from "react";

const BillingSummary = () => {
  const [billingSummary, setBillingSummary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setBillingSummary({
        weeklyRevenue: 12840,
        pendingPayouts: 3210,
        unpaidInvoices: 12,
        refunds: 480,
      });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">
        Billing Summary
      </h2>
      <div className="space-y-5">
        <div className="flex justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <span className="font-medium">Revenue This Week</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            ${billingSummary.weeklyRevenue?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <span className="font-medium">Pending Payouts (Couriers)</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            ${billingSummary.pendingPayouts?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <span className="font-medium">Unpaid Invoices</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {billingSummary.unpaidInvoices}
          </span>
        </div>
        <div className="flex justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <span className="font-medium">Refunds Processed</span>
          <span className="font-bold text-red-600 dark:text-red-400">
            ${billingSummary.refunds?.toLocaleString()}
          </span>
        </div>
      </div>
      <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow hover:shadow-lg">
        View Billing Dashboard
      </button>
    </div>
  );
};

export default BillingSummary;
