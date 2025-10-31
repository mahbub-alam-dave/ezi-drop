// components/skeletons/SiteSkeleton.js
export default function SiteSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* ===== Navbar Skeleton ===== */}
      <div className="h-16 bg-gray-200 dark:bg-gray-800 flex items-center px-6 shadow-sm">
        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mr-6"></div>
        <div className="hidden md:flex space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
        <div className="ml-auto h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* ===== Main Layout ===== */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-gray-100 dark:bg-gray-800 p-4 space-y-4 border-r border-gray-200 dark:border-gray-700">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-8">
          {/* Page Header */}
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          </div>

          {/* Stats / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              ></div>
            ))}
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              ></div>
            ))}
          </div>

          {/* Bottom Table or Activity Section */}
          <div className="bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-72"></div>
        </div>
      </div>
    </div>
  );
}

