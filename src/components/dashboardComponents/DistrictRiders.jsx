"use client";
import { useEffect, useState } from "react";

export default function DistrictRiders() {
  const [riders, setRiders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch riders whenever filter changes
  useEffect(() => {
    fetchRiders();
  }, [statusFilter]);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/api/district-riders?status=${statusFilter}` : `/api/riders`;
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🧍‍♂️ District Riders</h2>

        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-600">
            Filter by status:
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none"
          >
            <option value="">All</option>
            <option value="duty">On Duty</option>
            <option value="vacation">On Vacation</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading riders...</p>
      ) : riders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No riders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Name
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Phone
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Email
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{rider.name || "N/A"}</td>
                  <td className="p-3">{rider.phone || "N/A"}</td>
                  <td className="p-3">{rider.email || "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        rider.status === "duty"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rider.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
