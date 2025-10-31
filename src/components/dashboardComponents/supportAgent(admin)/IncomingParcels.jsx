"use client";

import { useEffect, useState, useMemo } from "react";
import { showErrorAlert, showSuccessAlert } from "@/utility/alerts";
import { 
  PackageOpen, 
  Search, 
  Filter, 
  ArrowDownUp, 
  MapPin, 
  Clock, 
  User,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function IncomingParcels() {
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [assigningParcel, setAssigningParcel] = useState(null);

  useEffect(() => {
    async function fetchParcels() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/transfers/incoming`);
        if (!res.ok) throw new Error("Failed to fetch parcels");
        const { parcels } = await res.json();
        setParcels(parcels);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchParcels();
  }, []);

  const filteredParcels = useMemo(() => {
    return parcels
      .filter((p) => p.status !== "completed")
      .filter((p) => (filter === "all" ? true : p.status === filter))
      .filter((p) =>
        p.parcelId.toLowerCase().includes(search.toLowerCase().trim())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [parcels, filter, search]);

  const canAssign = (expectedArrival) => {
    if (!expectedArrival) return false;
    return new Date(expectedArrival) <= new Date();
  };

  const handleAssignRider = async (parcelId) => {
    try {
      setAssigningParcel(parcelId);
      const res = await fetch(`/api/transfers/assign-rider/${parcelId}`, { 
        method: "PATCH" 
      });
      if (!res.ok) throw new Error("Failed to assign rider");
      const data = await res.json();
      showSuccessAlert("Rider Assigned", data.message || "Rider assigned successfully!");
      
      setParcels(prevParcels =>
        prevParcels.map(p =>
          p.parcelId === parcelId ? { ...p, status: "rider_assigned" } : p
        )
      );
    } catch (err) {
      console.error(err);
      showErrorAlert("Assignment Failed", err.message || "Something went wrong.");
    } finally {
      setAssigningParcel(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      dispatched: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-700",
        label: "Dispatched"
      },
      arrived: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-300 dark:border-green-700",
        label: "Arrived"
      },
      rider_assigned: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-300 dark:border-purple-700",
        label: "Rider Assigned"
      },
      delivered: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-300 dark:border-emerald-700",
        label: "Delivered"
      }
    };
    return configs[status] || configs.dispatched;
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
              <div key={j} className="h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full flex items-center justify-center mb-4">
        <PackageOpen className="w-10 h-10 text-orange-600 dark:text-orange-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Incoming Parcels
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {search || filter !== "all"
          ? "No parcels match your current filters. Try adjusting your search or filter criteria."
          : "There are no incoming parcels at the moment. New parcels will appear here when they arrive."}
      </p>
    </div>
  );

  const stats = useMemo(() => {
    const total = parcels.filter(p => p.status !== "completed").length;
    const dispatched = parcels.filter(p => p.status === "dispatched").length;
    const arrived = parcels.filter(p => p.status === "arrived").length;
    const riderAssigned = parcels.filter(p => p.status === "rider_assigned").length;
    return { total, dispatched, arrived, riderAssigned };
  }, [parcels]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
              <PackageOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Incoming Parcels
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            Track and manage parcels arriving at your district
          </p>
        </div>

        {/* Stats Cards */}
        {!isLoading && parcels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Active
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <PackageOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Dispatched
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.dispatched}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <ArrowDownUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Arrived
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.arrived}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Assigned
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.riderAssigned}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Parcel ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="sm:w-64 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="dispatched">Dispatched</option>
                <option value="arrived">Arrived</option>
                <option value="rider_assigned">Rider Assigned</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : filteredParcels.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Parcel ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Dispatched By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Requested At
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredParcels.map((parcel) => {
                    const readyToAssign = canAssign(parcel.expectedArrival);
                    const statusConfig = getStatusConfig(parcel.status);
                    const isAssigning = assigningParcel === parcel.parcelId;

                    return (
                      <tr 
                        key={parcel._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                            {parcel.parcelId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {parcel.fromDistrictId.replace("ezi-drop-", "").replace("-01", "")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {parcel.toDistrictId.replace("ezi-drop-", "").replace("-01", "")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {parcel.createdBy?.type || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(parcel.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {parcel.status === "rider_assigned" ? (
                            <span className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Assigned
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAssignRider(parcel.parcelId)}
                              disabled={!readyToAssign || isAssigning}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                readyToAssign && !isAssigning
                                  ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-sm hover:shadow-md"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {isAssigning ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Assigning...
                                </span>
                              ) : readyToAssign ? (
                                "Assign Rider"
                              ) : (
                                "Waiting..."
                              )}
                            </button>
                          )}
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