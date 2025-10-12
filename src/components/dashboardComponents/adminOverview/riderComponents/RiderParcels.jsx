"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function RiderParcels() {
  const [newOrders, setNewOrders] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");

  const riderId = "currentRiderId"; // replace with logged-in rider _id

  useEffect(() => {
    fetchData();
  }, [filter]);

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

  async function handleAccept(parcelId) {
    await fetch(`/api/riders/accept/${parcelId}`, { method: "PATCH" });
    fetchData();
  }

  async function handleReject(parcelId) {
    await fetch(`/api/riders/reject/${parcelId}`, { method: "PATCH" });
    fetchData();
  }

  async function handleComplete(parcelId) {
    await fetch(`/api/riders/complete/${parcelId}`, { method: "PATCH" });
    fetchData();
  }

  const filteredParcels = parcels.filter(
    (p) =>
      p.parcelId.toLowerCase().includes(search.toLowerCase()) ||
      p.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      p.deliveryDistrict.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">📦 My Parcels</h1>
        <p className="text-gray-500">Manage your assigned and delivered parcels efficiently.</p>
      </div>

      {/* 🔔 New Orders Section */}
      {newOrders.length > 0 && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <h2 className="text-lg font-semibold text-blue-700">New Orders</h2>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {newOrders.map((parcel) => (
              <div key={parcel._id} className="border rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800">{parcel.parcelType}</h3>
                <p className="text-sm text-gray-600">From: {parcel.pickupDistrict}</p>
                <p className="text-sm text-gray-600">To: {parcel.deliveryDistrict}</p>
                <p className="text-sm text-gray-600">Amount: {parcel.amount} BDT</p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => handleAccept(parcel._id)} className="bg-green-600 hover:bg-green-700 w-full">
                    Accept
                  </Button>
                  <Button onClick={() => handleReject(parcel._id)} className="bg-red-600 hover:bg-red-700 w-full">
                    Reject
                  </Button>
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Parcels Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
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
                <tr key={parcel._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{parcel.parcelId}</td>
                  <td className="p-3">{parcel.receiverName}</td>
                  <td className="p-3">{parcel.pickupDistrict}</td>
                  <td className="p-3">{parcel.deliveryDistrict}</td>
                  <td className="p-3 capitalize">{parcel.status}</td>
                  <td className="p-3">{parcel.amount} BDT</td>
                  <td className="p-3">
                    {parcel.status === "pending" ? (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleComplete(parcel._id)}
                      >
                        Complete Order
                      </Button>
                    ) : (
                      <span className="text-green-600 font-semibold">Completed</span>
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
    </div>
  );
}
