"use client";
import { useEffect, useState } from "react";

export default function DistrictAdminParcels({ districtId }) {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParcels();
  }, []);

  // 🔹 Fetch all waiting parcels for the admin district
  const fetchParcels = async () => {
    const res = await fetch("/api/unassigned-parcels");
    const data = await res.json();
    if (data.ok) setParcels(data.parcels);
  };

  // 🔹 Fetch riders automatically by parcel ID
  const openAssignModal = async (parcel) => {
    setSelectedParcel(parcel);
    setLoading(true);

    const res = await fetch("/api/district-wise-rider", {
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

    setLoading(false);
  };

  // 🔹 Assign rider to parcel
  const assignRider = async (riderId) => {
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
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 Waiting Parcels</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Parcel ID</th>
            <th className="p-2 border">Sender</th>
            <th className="p-2 border">Delivery Type</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.parcelId}</td>
              <td className="p-2 border">{p.senderName}</td>
              <td className="p-2 border capitalize">{p.deliveryType}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => openAssignModal(p)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Assign Rider
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Assign Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-center">
              Assign Rider for {selectedParcel.parcelId}
            </h3>

            {loading ? (
              <p className="text-center text-gray-500">Loading riders...</p>
            ) : riders.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {riders.map((r) => (
                  <div
                    key={r._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.phone || "N/A"}</p>
                    </div>
                    <button
                      onClick={() => assignRider(r._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No available riders found.
              </p>
            )}

            <button
              onClick={() => setSelectedParcel(null)}
              className="mt-4 bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
