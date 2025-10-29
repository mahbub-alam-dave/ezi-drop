import React from "react";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      {/*  Title Skeleton */}
      <div className="animate-pulse bg-gray-300 h-8 w-1/3 mx-auto rounded-lg"></div>

      {/*  Paragraph Skeleton */}
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>

      {/*  Section 1: Image Left, Text + Buttons Right */}
      <div className="flex flex-col md:flex-row items-center gap-6 animate-pulse">
        {/* Left: Image */}
        <div className="bg-gray-300 rounded-2xl h-64 w-full md:w-1/2"></div>
        {/* Right: Text */}
        <div className="flex flex-col space-y-4 w-full md:w-1/2">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-2/3"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-10 w-24 bg-gray-300 rounded-full"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/*  Section 2: Image Right, Text + Buttons Left */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-6 animate-pulse">
        {/* Right: Image */}
        <div className="bg-gray-300 rounded-2xl h-64 w-full md:w-1/2"></div>
        {/* Left: Text */}
        <div className="flex flex-col space-y-4 w-full md:w-1/2">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-2/3"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-10 w-24 bg-gray-300 rounded-full"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
