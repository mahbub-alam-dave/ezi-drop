"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { showErrorAlert, showSuccessAlert } from "@/utility/alerts";
import RouteSuggestionModal from "./RouteSuggestionModal";

export default function RiderParcels() {
  const [newOrders, setNewOrders] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  // modal
   const [isOpen, setIsOpen] = useState(false);
   const [secretCode, setSecretCode] = useState("");
   const [parcelId, setParcelId] = useState(null);
   const [error, setError] = useState("")
   const [success, setSuccess] = useState("");

   const [selectedParcel, setSelectedParcel] = useState(null);


  // const riderId = "currentRiderId"; // replace with logged-in rider _id
  const {data: session, status} = useSession()
  const riderId = session?.user?.userId;




  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(`/api/riders/${riderId}/parcels?status=${filter}`);
      const data = await res.json();
      setNewOrders(data.newOrders || []);
      setParcels(data.parcels || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(status === "authenticated" && riderId) {
      fetchData()
    }
  },[status, riderId])

    useEffect(() => {
    fetchData();
  }, [filter]);

/*   async function handleAccept(parcelId) {
    await fetch(`/api/riders/accept/${parcelId}`, { method: "PATCH" });
    fetchData();
  }

  async function handleReject(parcelId) {
    await fetch(`/api/riders/reject/${parcelId}`, { method: "PATCH" });
    fetchData();
  } */

  async function handleAccept(parcelId) {
  try {
    const res = await fetch(`/api/riders/accept/${parcelId}`, { method: "PATCH" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to accept parcel");

    showSuccessAlert("Parcel Accepted", data.message || "You have successfully accepted the parcel.");
    fetchData();
  } catch (error) {
    console.error(error);
    showErrorAlert("Accept Failed", error.message || "Something went wrong while accepting the parcel.");
  }
}

async function handleReject(parcelId) {
  try {
    const res = await fetch(`/api/riders/reject/${parcelId}`, { method: "PATCH" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to reject parcel");

    showSuccessAlert("Parcel Rejected", data.message || "You have successfully rejected the parcel.");
    fetchData();
  } catch (error) {
    console.error(error);
    showErrorAlert("Reject Failed", error.message || "Something went wrong while rejecting the parcel.");
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
    setLoading(true);
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
      setTimeout(() => setIsOpen(false), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-color">📦 My Parcels</h1>
        <p className="text-color-soft">Manage your assigned and delivered parcels efficiently.</p>
      </div>

      {/* 🔔 New Orders Section */}
      {newOrders.length > 0 && (
        <Card className="border-l-4 border-color bg-transparent">
          <CardHeader>
            <h2 className="text-lg font-semibold text-color">New Orders</h2>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {newOrders.map((parcel) => (
              <div key={parcel._id} className="border-color rounded-2xl p-4 background-color">
                <h3 className="font-semibold text-color">{ parcel.parcelType}</h3>
                <p className="text-sm text-color-soft">From: { parcel.status ==="pending_rider_approval" ? `${parcel.pickupDistrict}, (${parcel.deliveryAddress})` : parcel.deliveryDistrict ("from wirehouse")}</p>
                <p className="text-sm text-color-soft">To: {parcel.deliveryType === "to_wirehouse" ? parcel.wirehouseAddress : `${parcel.deliveryDistrict}, (${parcel.deliveryAddress})`}</p>
                <p className="text-sm text-color-soft">Amount: {parcel.amount} BDT</p>
                {/* <button>View Details</button> */}
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => handleAccept(parcel._id)} className="bg-transparent border-color text-color hover:bg-[#cecece] dark:hover:bg-[#363636]  w-full">
                    View details
                  </Button>
                  <Button onClick={() => handleAccept(parcel.parcelId)} className="background-color-primary text-gray-100 w-full">
                    Accept
                  </Button>
                  <Button onClick={() => handleReject(parcel._id)} className="border-color w-full">
                    Reject
                  </Button>
                  <Button onClick={() => setSelectedParcel(parcel)}>Get AI Route</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
        <Input
          placeholder="Search by parcel ID, receiver or district..."
          className="w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Parcels Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead className="background-color">
            <tr className="text-left text-color text-normal">
              <th className="p-3">Parcel ID</th>
              <th className="p-3">Receiver</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Delivery</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  <Loader2 className="animate-spin inline mr-2" /> Loading...
                </td>
              </tr>
            ) : filteredParcels.length > 0 ? (
              filteredParcels.slice(0, 10).map((parcel) => (
                <tr key={parcel._id} className="border-b bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="p-3 font-medium">{parcel.parcelId}</td>
                  <td className="p-3">{parcel.receiverName}</td>
                  <td className="p-3">{parcel.pickupDistrict}</td>
                  <td className="p-3">{parcel.deliveryDistrict}</td>
                  <td className="p-3 capitalize">{parcel.riderApprovalStatus}</td>
                  <td className="p-3">{parcel.amount} BDT</td>
                  <td className="p-3">
                    {parcel.riderApprovalStatus === "accepted" && parcel.status !== "completed" || parcel.status !== "at_local_warehouse" ? (
                      <Button
                        size="sm"
                        className="background-color-primary text-gray-100"
                        // onClick={() => handleComplete(parcel._id)}
                        onClick={() => {
                          setIsOpen(true)
                          setParcelId(parcel._id)
                        }}
                      >
                        Complete Order
                      </Button>
                    ) : (
                      <span className="text-[var(--color-primary)] font-semibold">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No parcels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="background-color p-6 rounded-xl w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Enter Secret Code</h2>
            <input
              type="text"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter code"
              className="border rounded w-full p-2 mb-3 focus:outline-blue-500"
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ai route suggestion modal */}
      {selectedParcel && (
        <RouteSuggestionModal
          parcel={selectedParcel}
          open={!!selectedParcel}
          onClose={() => setSelectedParcel(null)}
        />
      )}
    </div>
  );
}
