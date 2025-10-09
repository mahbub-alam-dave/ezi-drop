import React from "react";

export default function Loading() {
  return (
    <div className="p-6 space-y-10 animate-pulse">
      {/* 🔹 Title */}
      <div className="h-8 bg-gray-300 rounded-lg w-1/3 mx-auto"></div>

      {/* 🔹 Paragraph */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>

      {/* 🔹 Section 1: Left (Address) | Right (Form) */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Address */}
        <div className="bg-gray-300 rounded-2xl h-64 w-full md:w-1/2"></div>

        {/* Right: Contact Form */}
        <div className="flex flex-col space-y-4 w-full md:w-1/2">
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-32 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded-full w-32"></div>
        </div>
      </div>

      {/* 🔹 Section 2: 3 Div Side by Side (Map Section) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-300 rounded-xl h-48"></div>
        <div className="bg-gray-300 rounded-xl h-48"></div>
        <div className="bg-gray-300 rounded-xl h-48"></div>
      </div>

      {/* 🔹 Section 3: 3 Card with Title */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-gray-200 rounded-2xl flex flex-col items-center space-y-3"
          >
            <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            <div className="h-20 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
