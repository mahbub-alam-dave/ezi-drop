"use client"
import React, { useState } from 'react';

const AIinsightBanner = () => {
    const [aiInsight, setAiInsight] = useState("High delivery volume expected in Downtown Zone tomorrow — pre-assign 5 extra couriers.");
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 text-white p-3 rounded-xl shadow-lg">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">AI-Powered Insight</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiInsight}</p>
          </div>
        </div>
      </div>
    );
};

export default AIinsightBanner;