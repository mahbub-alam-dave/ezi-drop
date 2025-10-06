// components/skeletons/DashboardSkeleton.js
export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="h-32 bg-gray-300 rounded col-span-2"></div>
      <div className="h-32 bg-gray-300 rounded"></div>
      <div className="h-64 bg-gray-300 rounded col-span-3"></div>
    </div>
  );
}
