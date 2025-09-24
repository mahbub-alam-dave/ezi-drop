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
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Ahmed",
      email: "ahmed@example.com",
      phone: "+8801789456105",
      address: "Dhaka, Bangladesh",
      experience: "2 years",
      licenseNo: "DL-2024-9876",
      vehicleType: "Motorbike",
      status: "Pending",
    },
    {
      id: 2,
      name: "Alam",
      email: "alom@example.com",
      phone: "+88017123450000",
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
    <div className="p-6 background-color min-h-screen">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-8">
        Manage Rider Applications
      </h1>

      <div className="overflow-x-auto rounded-xl shadow border border-[var(--color-border)] background-color">
        <table className="min-w-full">
          <thead className="bg-[var(--color-primary)] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Applicant Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t hover:bg-[var(--color-muted)] transition-all"
              >
                <td className="px-6 py-3 text-color">{app.name}</td>
                <td className="px-6 py-3 text-color-soft">{app.email}</td>
                <td className="px-6 py-3 text-color-soft">{app.phone}</td>
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
                    className="text-sm background-color-secondary text-white hover:opacity-90 transition"
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
        <DialogContent className="max-w-md background-color">
          <DialogHeader>
            <DialogTitle className="text-color">Applicant Details</DialogTitle>
            <DialogDescription className="text-color-soft">
              View and manage the selected rider’s application.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-3 mt-4 text-color">
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
                  className="background-color-primary text-white hover:opacity-90"
                  onClick={() => handleStatus(selected.id, "Accepted")}
                >
                  Accept
                </Button>
                <Button
                  className="background-color-secondary text-white hover:opacity-90"
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
