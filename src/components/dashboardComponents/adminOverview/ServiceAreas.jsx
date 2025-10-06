"use client"
import React, { useEffect, useState } from 'react';

const ServiceAreas = () => {

      const [serviceAreas, setServiceAreas] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
    
      useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 1500));
    
          setServiceAreas([
        { name: 'Downtown Core', radius: '3 km', price: '$5.99', status: 'active' },
        { name: 'Suburban North', radius: '8 km', price: '$8.99', status: 'active' },
        { name: 'Airport Zone', radius: '5 km', price: '$12.99', status: 'active' },
        { name: 'Rural West', radius: '15 km', price: '$15.99', status: 'limited' },
      ]);
          setIsLoading(false);
        };
        fetchData();
      }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Service Areas</h2>
            <button className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
          </div>
          <div className="space-y-4">
            {serviceAreas.map((area, i) => (
              <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 dark:text-white">{area.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    area.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {area.status}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Radius: {area.radius}</div>
                  <div>Base Price: {area.price}</div>
                  <div>Delivery Window: 9AM - 9PM</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl font-medium transition-colors">
            + Add New Service Area
          </button>
        </div>
    );
};

export default ServiceAreas;