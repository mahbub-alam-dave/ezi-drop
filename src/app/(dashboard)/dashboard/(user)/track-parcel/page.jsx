
import TrackParcelTable from "./TrackParcelTable";

export default function TrackParcelPage() {
  return (
  <div className="min-h-screen bg-white dark:bg-gray-900">
  <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Header Section */}
    <div className="text-center mb-12">
      <div className="flex justify-center items-center space-x-4 mb-6">
        <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Parcel Management
        </h1>
        <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-lg uppercase tracking-wider">
        REAL-TIME TRACKING SYSTEM
      </p>
    </div>

    {/* Content Box */}
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
          Active Shipments
        </h2>
      </div>
      <TrackParcelTable />
    </div>
  </div>
</div>
  );
}
