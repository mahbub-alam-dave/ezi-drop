"use client"
import React from 'react';
import { motion } from 'framer-motion';

const MapAndHeatmap = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* live map */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Live Courier Tracking Map</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Fullscreen</button>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl h-80 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 opacity-10">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-500" style={{ top: `${(i + 1) * 12.5}%` }}></div>
                  ))}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-full w-px bg-slate-500" style={{ left: `${(i + 1) * 12.5}%` }}></div>
                  ))}
                </div>

                {[
                  { x: '25%', y: '30%', color: 'bg-blue-500', id: 'C001' },
                  { x: '65%', y: '45%', color: 'bg-green-500', id: 'C002' },
                  { x: '40%', y: '70%', color: 'bg-amber-500', id: 'C003' },
                  { x: '80%', y: '20%', color: 'bg-purple-500', id: 'C004' },
                  { x: '15%', y: '60%', color: 'bg-red-500', id: 'C005' },
                ].map((courier, idx) => (
                  <motion.div
                    key={idx}
                    className={`absolute w-4 h-4 rounded-full ${courier.color} shadow-lg cursor-pointer`}
                    style={{ left: courier.x, top: courier.y }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                    title={`Courier ${courier.id}`}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 whitespace-nowrap transition-opacity">
                      {courier.id}
                    </div>
                  </motion.div>
                ))}

                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Active Couriers: 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-center">Zone A</div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-center">Zone B</div>
            <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-center">Zone C</div>
            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-center">Zone D</div>
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-center">Zone E</div>
          </div>
        </div>

        {/* delivery heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">Delivery Heatmap</h2>
          <div className="space-y-4">
            {[
              { zone: 'Downtown', deliveries: 320, color: 'bg-red-500', trend: '+18%' },
              { zone: 'Uptown', deliveries: 210, color: 'bg-orange-500', trend: '+7%' },
              { zone: 'East Hub', deliveries: 180, color: 'bg-amber-500', trend: '-2%' },
              { zone: 'West Zone', deliveries: 140, color: 'bg-blue-500', trend: '+12%' },
              { zone: 'North Hills', deliveries: 90, color: 'bg-green-500', trend: '+5%' },
            ].map((zone, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                  <span className="font-medium">{zone.zone}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{zone.deliveries}</div>
                  <div className={`text-xs ${zone.trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {zone.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              ⚠️ Downtown zone exceeding capacity — consider adding temporary staff.
            </p>
          </div>
        </div>
      </div>
    );
};

export default MapAndHeatmap;