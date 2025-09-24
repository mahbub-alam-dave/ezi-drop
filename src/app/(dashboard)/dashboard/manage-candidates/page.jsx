"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ManageCandidatesPage() {
  // ফেক অ্যাপ্লিকেশন ডাটা
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Sefat Ahmed",
      email: "sefat@example.com",
      phone: "+8801789456123",
      address: "Dhaka, Bangladesh",
      experience: "2 years",
      licenseNo: "DL-2024-9876",
      vehicleType: "Motorbike",
      status: "Pending",
    },
    {
      id: 2,
      name: "Mahbub Alam",
      email: "mahbub@example.com",
      phone: "+8801712345678",
      address: "Chattogram, Bangladesh",
      experience: "3 years",
      licenseNo: "DL-2023-1122",
      vehicleType: "Scooter",
      status: "Pending",
    },
  ]);

  const [selected, setSelected] = useState(null);

  const handleStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    setSelected(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Rider Applications</h1>

      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-6 py-3 font-semibold">Applicant Name</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Phone</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{app.name}</td>
                <td className="px-6 py-3">{app.email}</td>
                <td className="px-6 py-3">{app.phone}</td>
                <td
                  className={`px-6 py-3 font-semibold ${
                    app.status === "Accepted"
                      ? "text-green-600"
                      : app.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </td>
                <td className="px-6 py-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelected(app)}
                    className="text-sm"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>
              View and manage the selected rider’s application.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-3 mt-4">
              <p>
                <strong>Name:</strong> {selected.name}
              </p>
              <p>
                <strong>Email:</strong> {selected.email}
              </p>
              <p>
                <strong>Phone:</strong> {selected.phone}
              </p>
              <p>
                <strong>Address:</strong> {selected.address}
              </p>
              <p>
                <strong>Experience:</strong> {selected.experience}
              </p>
              <p>
                <strong>License No:</strong> {selected.licenseNo}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {selected.vehicleType}
              </p>

              <div className="flex gap-3 mt-6">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatus(selected.id, "Accepted")}
                >
                  Accept
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleStatus(selected.id, "Rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
