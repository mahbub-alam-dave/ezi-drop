export default function DashboardSkeleton() {
  return (
    <div className="h-screen w-full flex bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Sidebar (hidden on small screens) */}
{/*       <div className="hidden lg:flex flex-col w-64 bg-gray-200/60 dark:bg-gray-800/60 border-r border-gray-300/30 dark:border-gray-700/30 p-4 space-y-4">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md"
            ></div>
          ))}
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-gray-200/60 dark:bg-gray-800/60 border-b border-gray-300/30 dark:border-gray-700/30">
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Top Header (for large screens) */}
        <div className="hidden lg:flex items-center justify-between p-6 bg-white/70 dark:bg-gray-800/70 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/30 dark:border-gray-700/30 p-4 space-y-4"
            >
              <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="flex space-x-3">
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
