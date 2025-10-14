"use client";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function OutgoingParcels({ admin }) {
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

/*   useEffect(() => {
    if (admin?.districtId) fetchParcels();
  }, [admin?.districtId]); */

  async function fetchParcels() {
    try {
      setLoading(true);
    //   ?fromDistrictId=${admin.districtId}
      const res = await fetch(`/api/transfers`);
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

  useEffect(()=>{
    fetchParcels()
  },[])

  console.log(parcels)

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
    if (!confirm("Confirm dispatch of this parcel?")) return;
    try {
      const res = await fetch(`/api/transfers/dispatch/${parcelId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchParcels();
      }
    } catch (err) {
      console.error("Error dispatching parcel:", err);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">🚚 Outgoing Parcels</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search by parcel ID or district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending Dispatch</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading parcels...</p>
      ) : filteredParcels.length === 0 ? (
        <p className="text-gray-500 text-sm">No outgoing parcels found.</p>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parcel ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParcels.map(parcel => (
                <TableRow key={parcel._id}>
                  <TableCell>{parcel.parcelId}</TableCell>
                  <TableCell>{parcel.fromDistrictId.split("-")[2]}</TableCell>
                  <TableCell>{parcel.toDistrictId.split("-")[2]}</TableCell>
                  <TableCell>
                    {parcel.createdBy.type} #{parcel.createdBy.id?.slice(-5)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(parcel.createdAt), "PPp")}
                  </TableCell>
                  <TableCell>
                    {parcel.status === "requested" ? (
                      <Button
                        size="sm"
                        onClick={() => handleDispatch(parcel.parcelId)}
                      >
                        Dispatch
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-sm">Dispatched</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
