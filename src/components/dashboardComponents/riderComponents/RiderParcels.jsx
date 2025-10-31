"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { showErrorAlert, showSuccessAlert } from "@/utility/alerts";
import RouteSuggestionModal from "./RouteSuggestionModal";
import {
  Package,
  Search,
  Filter,
  MapPin,
  Navigation,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  DollarSign,
  Clock,
  Bell,
  Truck,
  User,
  Home,
  AlertCircle,
  X
} from "lucide-react";

export default function RiderParcels() {
  const [newOrders, setNewOrders] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [parcelId, setParcelId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [acceptingParcel, setAcceptingParcel] = useState(null);
  const [rejectingParcel, setRejectingParcel] = useState(null);
  const [completingOrder, setCompletingOrder] = useState(false);

  const { data: session, status } = useSession();
  const riderId = session?.user?.userId;

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(`/api/riders/my-parcels?status=${filter}`);
      const data = await res.json();
      setNewOrders(data.newOrders || []);
      setParcels(data.parcels || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && riderId) {
      fetchData();
    }
  }, [status, riderId]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function handleAccept(parcelId) {
    try {
      setAcceptingParcel(parcelId);
      const res = await fetch(`/api/riders/accept/${parcelId}`, { method: "PATCH" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to accept parcel");

      showSuccessAlert("Parcel Accepted", data.message || "You have successfully accepted the parcel.");
      fetchData();
    } catch (error) {
      console.error(error);
      showErrorAlert("Accept Failed", error.message || "Something went wrong while accepting the parcel.");
    } finally {
      setAcceptingParcel(null);
    }
  }

  async function handleReject(parcelId) {
    try {
      setRejectingParcel(parcelId);
      const res = await fetch(`/api/riders/reject/${parcelId}`, { method: "PATCH" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reject parcel");

      showSuccessAlert("Parcel Rejected", data.message || "You have successfully rejected the parcel.");
      fetchData();
    } catch (error) {
      console.error(error);
      showErrorAlert("Reject Failed", error.message || "Something went wrong while rejecting the parcel.");
    } finally {
      setRejectingParcel(null);
    }
  }

  const filteredParcels = parcels.filter(
    (p) =>
      p.parcelId.toLowerCase().includes(search.toLowerCase()) ||
      p.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      p.deliveryDistrict.toLowerCase().includes(search.toLowerCase())
  );

  async function handleComplete() {
    if (!secretCode) {
      setError("Please enter the secret code");
      return;
    }
    setCompletingOrder(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/riders/complete/${parcelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretCode }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess("✅ Delivery completed successfully");
      setTimeout(() => {
        setIsOpen(false);
        setSecretCode("");
        fetchData();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setCompletingOrder(false);
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      accepted: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-300 dark:border-green-700",
        label: "Accepted"
      },
      pending: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-300 dark:border-amber-700",
        label: "Pending"
      },
      completed: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-700",
        label: "Completed"
      }
    };
    return configs[status] || configs.pending;
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
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
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Parcels Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md text-sm">
        {search
          ? "No parcels match your search criteria."
          : "You don't have any parcels assigned yet."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Parcels
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            Manage your assigned and delivered parcels efficiently
          </p>
        </div>

        {/* New Orders Section */}
        {newOrders.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Orders ({newOrders.length})
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {newOrders.map((parcel) => (
                <div
                  key={parcel._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {parcel.parcelType}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {parcel.parcelId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">From: </span>
                        <span className="text-gray-900 dark:text-gray-200">
                          {parcel.status === "pending_rider_approval"
                            ? `${parcel.pickupDistrict}, (${parcel.deliveryAddress})`
                            : `${parcel.deliveryDistrict} (from warehouse)`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">To: </span>
                        <span className="text-gray-900 dark:text-gray-200">
                          {parcel.deliveryType === "to_wirehouse"
                            ? parcel.wirehouseAddress
                            : `${parcel.deliveryDistrict}, (${parcel.deliveryAddress})`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {parcel.amount} BDT
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(parcel.parcelId)}
                      disabled={acceptingParcel === parcel.parcelId}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {acceptingParcel === parcel.parcelId ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(parcel._id)}
                      disabled={rejectingParcel === parcel._id}
                      className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {rejectingParcel === parcel._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by parcel ID, receiver or district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:w-48 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parcels Table */}
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
                      Receiver
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Pickup
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredParcels.slice(0, 10).map((parcel) => {
                    const statusConfig = getStatusConfig(parcel.riderApprovalStatus);
                    
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
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {parcel.receiverName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {parcel.pickupDistrict}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {parcel.deliveryDistrict}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            <DollarSign className="w-4 h-4" />
                            {parcel.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {parcel.riderApprovalStatus === "accepted" &&
                          parcel.status !== "completed" &&
                          parcel.status !== "at_local_warehouse" ? (
                            <div className="flex gap-2 items-center justify-center">
                              <button
                                onClick={() => {
                                  setIsOpen(true);
                                  setParcelId(parcel._id);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Complete
                              </button>
                              <button
                                onClick={() => setSelectedParcel(parcel)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                              >
                                <Navigation className="w-4 h-4" />
                                AI Route
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-400 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
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

        {/* Complete Order Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Complete Delivery
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSecretCode("");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the secret code provided by the receiver to confirm delivery completion.
                </p>

                <div className="relative">
                  <input
                    type="text"
                    value={secretCode}
                    onChange={(e) => {
                      setSecretCode(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter secret code"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-center text-lg tracking-wider"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSecretCode("");
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                  disabled={completingOrder}
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  disabled={completingOrder || !secretCode}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Route Suggestion Modal */}
        {selectedParcel && (
          <RouteSuggestionModal
            parcel={selectedParcel}
            open={!!selectedParcel}
            onClose={() => setSelectedParcel(null)}
          />
        )}
      </div>
    </div>
  );
}