"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { showErrorAlert, showSuccessAlert } from "@/utility/alerts";

export default function IncomingParcels() {
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [riderAssigned, setRiderAssigned] = useState(false)

  // ✅ Fetch incoming parcels
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
  },[]);

  // ✅ Filter + search logic
  const filteredParcels = useMemo(() => {
    return parcels
      .filter((p) => p.status !== "completed") // hide completed
      .filter((p) => (filter === "all" ? true : p.status === filter))
      .filter((p) =>
        p.parcelId.toLowerCase().includes(search.toLowerCase().trim())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [parcels, filter, search]);

  // ✅ Check if parcel is ready to assign
  const canAssign = (expectedArrival) => {
    if (!expectedArrival) return false;
    return new Date(expectedArrival) <= new Date();
  };

  // ✅ Assign rider handler
  const handleAssignRider = async (parcelId) => {
    try {
      const res = await fetch(`/api/transfers/assign-rider/${parcelId}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to assign rider");
      showSuccessAlert("Rider Assigned", data.message || "Rider assigned successfully!");
      setRiderAssigned(true)
    } catch (err) {
      console.error(err);
      showErrorAlert("Assignment Failed", err.message || "Something went wrong.");
    }
  };

  return (
    <div className="space-y-4 pt-8 p-6">
      <h2 className="text-xl font-semibold">Incoming Parcels</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <Input
          placeholder="Search by Parcel ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border border-color"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-2 border-color"
        >
          <option value="all">All</option>
          <option value="dispatched">Dispatched</option>
          <option value="arrived">Arrived</option>
          <option value="rider_assigned">Rider Assigned</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-md border-color">
        <Table>
          <TableHeader className="text-color">
            <TableRow>
              <TableHead>Parcel ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Dispatched By</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredParcels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No parcels found
                </TableCell>
              </TableRow>
            ) : (
              filteredParcels.map((parcel) => {
                const readyToAssign = canAssign(parcel.expectedArrival);
                return (
                  <TableRow key={parcel._id}>
                    <TableCell>{parcel.parcelId}</TableCell>
                    <TableCell>
                      {parcel.fromDistrictId.replace("ezi-drop-", "").replace("-01", "")}
                    </TableCell>
                    <TableCell>
                      {parcel.toDistrictId.replace("ezi-drop-", "").replace("-01", "")}
                    </TableCell>
                    <TableCell>{parcel.createdBy?.type || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(parcel.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {
                        riderAssigned === true ?
                        <span>Rider assigned</span>
                        :
                        <Button
                        onClick={() => handleAssignRider(parcel.parcelId)}
                        disabled={!readyToAssign}
                        className="text-sm"
                      >
                        {readyToAssign ? "Assign Rider" : "Waiting..."}
                      </Button>
                      }
                      
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
