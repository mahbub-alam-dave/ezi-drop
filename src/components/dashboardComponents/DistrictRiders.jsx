"use client";
import { useEffect, useState } from "react";
import { Users, Filter, Mail, Phone, UserCheck, UserX } from "lucide-react";

export default function DistrictRiders() {
  const [riders, setRiders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiders();
  }, [statusFilter]);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/district-riders?status=${statusFilter}`
        : `/api/district-riders`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) setRiders(data.riders);
      else console.error("Error:", data.message);
    } catch (error) {
      console.error("Failed to load riders:", error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="grid grid-cols-4 gap-6 p-5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mb-4">
        <UserX className="w-10 h-10 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Riders Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {statusFilter
          ? `No riders are currently ${statusFilter === "duty" ? "on duty" : "on vacation"}.`
          : "There are no riders registered in your district yet."}
      </p>
    </div>
  );

  const getStatusConfig = (status) => {
    if (status === "duty") {
      return {
        icon: UserCheck,
        text: "On Duty",
        bgClass: "bg-green-100 dark:bg-green-900/30",
        textClass: "text-green-700 dark:text-green-300",
        borderClass: "border-green-300 dark:border-green-700",
      };
    }
    return {
      icon: UserX,
      text: "On Vacation",
      bgClass: "bg-amber-100 dark:bg-amber-900/30",
      textClass: "text-amber-700 dark:text-amber-300",
      borderClass: "border-amber-300 dark:border-amber-700",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  District Riders
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-13">
                Manage and monitor all riders in your district
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status:
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="">All Riders</option>
                <option value="duty">On Duty</option>
                <option value="vacation">On Vacation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && riders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Riders
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {riders.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    On Duty
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {riders.filter((r) => r.working_status === "duty").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    On Vacation
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {riders.filter((r) => r.working_status === "vacation").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Riders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : riders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Rider Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {riders.map((rider) => {
                    const statusConfig = getStatusConfig(rider.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={rider._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {rider.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {rider.phone || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {rider.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}