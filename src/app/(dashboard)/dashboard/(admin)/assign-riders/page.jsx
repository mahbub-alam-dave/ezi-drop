"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import useLoadingSpinner from "@/hooks/useLoadingSpinner";
import { Search } from "lucide-react";

export default function AssignRiders() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

  
  // 🔹 Fetch all applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/rider-applications");
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error loading applications:", error);
        Swal.fire("Error", "Failed to load applications", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // 🔹 Filter logic (by name/email/district)
  const filteredApplications = applications.filter(
    (app) =>
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Accept Rider
  const handleAccept = async (userId, appId) => {
    try {
      const confirm = await Swal.fire({
        title: "Approve this rider?",
        text: "This will change the user's role to Rider.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, approve",
      });
      if (!confirm.isConfirmed) return;

      // Update status in application collection
      const res = await fetch(`/api/rider-applications/update-status/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!res.ok) throw new Error("Failed to update application");

      // Update user role
      await fetch(`/api/users/update-role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "rider" }),
      });

      Swal.fire("Approved!", "User is now a rider.", "success");
      setApplications((prev) => prev.filter((a) => a._id !== appId));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to approve application", "error");
    }
  };

  // 🔹 Reject Rider
  const handleReject = async (appId) => {
    try {
      const confirm = await Swal.fire({
        title: "Reject this application?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject",
        cancelButtonText: "Cancel",
      });
      if (!confirm.isConfirmed) return;

      const res = await fetch(`/api/rider-applications/update-status/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!res.ok) throw new Error("Failed to reject application");

      Swal.fire("Rejected!", "Application has been rejected.", "success");
      setApplications((prev) => prev.filter((a) => a._id !== appId));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to reject application", "error");
    }
  };

  if (loading) return useLoadingSpinner;

  return (
    <section className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
          Assign Riders
        </h2>
      </div>

      {/* 🔍 Stylish Search Bar */}
      <div className="relative w-full sm:w-96 mx-auto mb-10">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or district..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredApplications.length === 0 ? (
        <p>No rider applications found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">District</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredApplications.map((app, i) => (
                <tr key={app._id}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{app.applicantName}</td>
                  <td className="px-4 py-2">{app.applicantEmail}</td>
                  <td className="px-4 py-2">{app.mobileNumber}</td>
                  <td className="px-4 py-2">{app.district}</td>
                  <td className="px-4 py-2 capitalize">{app.status || "Pending"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAccept(app.userId, app._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(app._id)}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Modal for Application Details */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Rider Application Details</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p><strong>Name:</strong> {selectedApp.applicantName}</p>
              <p><strong>Email:</strong> {selectedApp.applicantEmail}</p>
              <p><strong>Phone:</strong> {selectedApp.mobileNumber}</p>
              <p><strong>District:</strong> {selectedApp.district}</p>
              <p><strong>Education:</strong> {selectedApp.education}</p>
              <p><strong>Summary:</strong> {selectedApp.profileSummary}</p>
              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={selectedApp.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {selectedApp.resumeLink}
                </a>
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleAccept(selectedApp.userId, selectedApp._id);
                  setSelectedApp(null);
                }}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleReject(selectedApp._id);
                  setSelectedApp(null);
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
