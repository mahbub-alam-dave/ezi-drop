"use client";
import { useEffect, useState, useMemo } from "react";
import { showErrorAlert, showSuccessAlert } from "@/utility/alerts";
import {
  PackagePlus,
  Search,
  Filter,
  Truck,
  MapPin,
  Clock,
  User,
  Send,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function OutgoingParcels({ admin }) {
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [dispatchingParcel, setDispatchingParcel] = useState(null);

  async function fetchParcels() {
    try {
      setLoading(true);
      const res = await fetch(`/api/transfers/outgoing`);
      if (res.ok) {
        const { transfers } = await res.json();
        setParcels(transfers || []);
      }
    } catch (err) {
      console.error("Error fetching outgoing parcels:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchParcels();
  }, []);

  const filteredParcels = useMemo(() => {
    return parcels
      .filter(p => {
        if (filter === "pending") return p.status === "requested";
        if (filter === "dispatched") return p.status === "dispatched";
        return true;
      })
      .filter(p =>
        p.parcelId.toLowerCase().includes(search.toLowerCase()) ||
        p.toDistrictId.toLowerCase().includes(search.toLowerCase())
      );
  }, [parcels, search, filter]);

  async function handleDispatch(parcelId) {
    try {
      setDispatchingParcel(parcelId);
      const res = await fetch(`/api/transfers/dispatch/${parcelId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        await fetchParcels();
        showSuccessAlert("Parcel Dispatched", data.message || "Parcel successfully dispatched to destination warehouse");
      } else {
        throw new Error("Dispatch failed");
      }
    } catch (err) {
      console.error("Error dispatching parcel:", err);
      showErrorAlert("Dispatch Failed", "Failed to dispatch the parcel to the destination warehouse");
    } finally {
      setDispatchingParcel(null);
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-full flex items-center justify-center mb-4">
        <PackagePlus className="w-10 h-10 text-teal-600 dark:text-teal-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Outgoing Parcels
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {search || filter !== "all"
          ? "No parcels match your current filters. Try adjusting your search or filter criteria."
          : "There are no outgoing parcels at the moment. New parcels will appear here when they're ready for dispatch."}
      </p>
    </div>
  );

  const stats = useMemo(() => {
    const total = parcels.length;
    const pending = parcels.filter(p => p.status === "requested").length;
    const dispatched = parcels.filter(p => p.status === "dispatched").length;
    return { total, pending, dispatched };
  }, [parcels]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Outgoing Parcels
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            Manage parcels being transferred to other districts
          </p>
        </div>

        {/* Stats Cards */}
        {!loading && parcels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Transfers
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <PackagePlus className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Pending Dispatch
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
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
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                placeholder="Search by parcel ID or district..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="sm:w-64 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
              >
                <option value="pending">Pending Dispatch</option>
                <option value="dispatched">Dispatched</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
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
                      Requested By
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
                  {filteredParcels.map(parcel => {
                    const isDispatching = dispatchingParcel === parcel.parcelId;
                    
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
                            <span className="capitalize">
                              {parcel.fromDistrictId.split("-")[2]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">
                              {parcel.toDistrictId.split("-")[2]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{parcel.createdBy.type}</span>
                            <span className="text-gray-400">
                              #{parcel.createdBy.id?.slice(-5)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDateTime(parcel.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {parcel.status === "requested" ? (
                            <button
                              onClick={() => handleDispatch(parcel.parcelId)}
                              disabled={isDispatching}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isDispatching
                                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                  : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-sm hover:shadow-md"
                              }`}
                            >
                              {isDispatching ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Dispatching...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Dispatch
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Dispatched
                            </span>
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