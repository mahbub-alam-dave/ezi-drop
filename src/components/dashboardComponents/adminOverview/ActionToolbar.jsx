"use client"
import React from 'react';

const ActionToolbar = () => {
    return (
      <div className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Quick Actions</h3>
        <div className="flex flex-col gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            ➕ Assign Courier
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            🔄 Reroute Delivery
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            📩 Notify Customers
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            🚨 Create Alert
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-colors shadow hover:shadow-lg">
            💰 Process Payout
          </button>
        </div>
      </div>
    );
};

export default ActionToolbar;