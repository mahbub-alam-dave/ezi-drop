"use client"
import { useSession } from 'next-auth/react';
import React from 'react';

const OverviewHeader = () => {

  const {data: session, status} = useSession()

    // ========== EXPORT HANDLER ==========
  const exportData = (format) => {
    alert(`Exporting as ${format.toUpperCase()}... (simulated)`);
  };
    return (
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {
            session?.user?.role === "district_admin" && status === "authenticated" ?
            `District Agent (${session?.user?.district})`
            : "Ezi Drop Admin"
            }
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time dashboard for intelligent delivery operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">Last updated: Today, 10:30 AM</span>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>🔄</span> Refresh Data
          </button>
          <div className="border-l border-slate-300 dark:border-slate-600 h-6 mx-2"></div>
          <button
            onClick={() => exportData('csv')}
            className="bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <span>📄</span> Export PDF
          </button>
        </div>
      </div>
    );
};

export default OverviewHeader;