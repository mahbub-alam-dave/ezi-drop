"use client"
import React, { useState } from 'react';

const TopCouriers = () => {
    const [topCouriers, setTopCouriers] = useState([
        { id: 1, name: 'John Doe', deliveries: 48, rating: 4.9, efficiency: '98%', available: true },
        { id: 2, name: 'Sarah Miller', deliveries: 42, rating: 4.8, efficiency: '95%', available: true },
        { id: 3, name: 'Mike Ross', deliveries: 39, rating: 4.7, efficiency: '93%', available: false },
        { id: 4, name: 'Anna Johnson', deliveries: 35, rating: 4.8, efficiency: '96%', available: true },
        { id: 5, name: 'David Wilson', deliveries: 32, rating: 4.6, efficiency: '91%', available: true },
      ]);

        // ========== TOGGLE COURIER ==========
  const toggleCourierAvailability = (id) => {
    setTopCouriers(prev =>
      prev.map(courier =>
        courier.id === id ? { ...courier, available: !courier.available } : courier
      )
    );
  };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Top Couriers</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Manage Team</button>
          </div>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {topCouriers.map((courier) => (
              <div key={courier.id} className="flex items-center justify-between pb-5 last:pb-0 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 text-white font-bold text-lg shadow">
                    {courier.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-slate-800 dark:text-white font-medium">{courier.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{courier.deliveries} deliveries • {courier.efficiency} efficiency</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-xs rounded-xl font-medium ${
                    courier.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {courier.available ? '🟢 Online' : '🔴 Offline'}
                  </span>
                  <button
                    onClick={() => toggleCourierAvailability(courier.id)}
                    className="w-8 h-8 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center text-xs transition-colors"
                  >
                    {courier.available ? '⏸️' : '▶️'}
                  </button>
                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1">
                    ⭐ {courier.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
};

export default TopCouriers;