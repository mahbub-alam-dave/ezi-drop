import React from "react";

export default function Loading() {
  return (
    <div className="p-6 space-y-10 animate-pulse">
      {/*  Title */}
      <div className="h-8 bg-gray-300 rounded-lg w-1/4 mx-auto"></div>

      {/*  Paragraph */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>

      {/*  Chart Section */}
      <div className="flex justify-center">
        <div className="bg-gray-300 rounded-full h-64 w-64"></div>
      </div>

      {/*  4 Cards (Image + Text) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 bg-gray-200 rounded-2xl flex flex-col items-center space-y-3"
          >
            <div className="h-20 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-5 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/*  Calendar Section */}
      <div className="bg-gray-300 rounded-2xl h-96 w-full"></div>

      {/* Table Section */}
      <div className="bg-gray-200 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-300">
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200"
          >
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
