import React from "react";

export default function Loading() {
  return (
    <div className="p-6 space-y-10 animate-pulse">

      {/* Title */}
      <div className="h-8 bg-gray-300 rounded-lg w-1/4 mx-auto"></div>

      {/*  Paragraph */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>

      {/*  Search & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Search Box */}
        <div className="h-10 bg-gray-300 rounded w-full md:w-1/2"></div>
        {/* Filter Option */}
        <div className="h-10 bg-gray-300 rounded w-full md:w-1/4"></div>
      </div>

      {/*  Table Section */}
      <div className="bg-gray-200 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-300">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 items-center"
          >
            {/* Image */}
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            {/* Name */}
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            {/* Email */}
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            {/* Role */}
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            {/* Status */}
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            {/* Action Button */}
            <div className="h-8 bg-gray-300 rounded-full w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
