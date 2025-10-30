"use client";
import { useEffect, useState } from "react";
import { Package, User, Phone, X, Loader2, PackageSearch } from "lucide-react";

export default function DistrictAdminParcels({ districtId }) {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ridersLoading, setRidersLoading] = useState(false);

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/unassigned-parcels");
      const data = await res.json();
      if (data.ok) setParcels(data.parcels);
    } catch (error) {
      console.error("Failed to fetch parcels:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = async (parcel) => {
    setSelectedParcel(parcel);
    setRidersLoading(true);

    try {
      const res = await fetch("/api/district-wise-riders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId: parcel.parcelId }),
      });
      const data = await res.json();

      if (data.ok) {
        setRiders(data.riders);
      } else {
        setRiders([]);
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch riders:", error);
      setRiders([]);
    } finally {
      setRidersLoading(false);
    }
  };

  const assignRider = async (riderId) => {
    try {
      const res = await fetch("/api/assign-rider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: selectedParcel.parcelId,
          riderId,
          deliveryType: selectedParcel.deliveryType,
          districtAdminName: "District Admin",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Rider assigned successfully!");
        setSelectedParcel(null);
        fetchParcels();
      } else {
        alert(data.message || "Failed to assign rider");
      }
    } catch (error) {
      alert("Failed to assign rider. Please try again.");
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-4">
        <PackageSearch className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Waiting Parcels
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        All parcels have been assigned to riders. New parcels will appear here when they're ready for assignment.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Parcel Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            Assign waiting parcels to available riders in your district
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : parcels.length === 0 ? (
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
                      Sender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Delivery Type
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {parcels.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                          {p.parcelId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {p.senderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                          {p.deliveryType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openAssignModal(p)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <User className="w-4 h-4" />
                          Assign Rider
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Assign Rider
                  </h3>
                  <p className="text-blue-100 text-sm font-mono">
                    {selectedParcel.parcelId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {ridersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                      <div className="h-9 w-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : riders.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {riders.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {r.name}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="truncate">{r.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => assignRider(r._id)}
                        className="ml-3 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    No available riders found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    All riders may be on vacation or busy
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedParcel(null)}
                className="w-full px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}