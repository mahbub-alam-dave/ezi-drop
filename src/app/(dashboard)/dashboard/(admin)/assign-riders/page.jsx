"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button"; 
import useLoadingSpinner from "@/hooks/useLoadingSpinner";

export default function AssignRiders() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  // ✅ Load all rider applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/rider-applications");
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error loading rider applications:", error);
        Swal.fire("Error", "Failed to load applications", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // ✅ Handle Accept button click
  const handleAccept = async (userId) => {
    try {
      const confirm = await Swal.fire({
        title: "Approve this rider?",
        text: "This will change the user role to Rider.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, approve",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) return;

      const res = await fetch(`/api/users/update-role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "rider" }),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire("Approved!", "User is now a rider.", "success");
        // remove accepted user from list
        setApplications((prev) => prev.filter((a) => a.userId !== userId));
      } else {
        Swal.fire("Error!", result.error || "Update failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  if (loading) return useLoadingSpinner

  return (
    <section className="p-6">
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-8">
        Assign Riders
      </h2>

      {applications.length === 0 ? (
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
              {applications.map((app, i) => (
                <tr key={app._id}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{app.applicantName}</td>
                  <td className="px-4 py-2">{app.applicantEmail}</td>
                  <td className="px-4 py-2">{app.mobileNumber}</td>
                  <td className="px-4 py-2">{app.district}</td>
                  <td className="px-4 py-2 capitalize">
                    {app.status || "Pending"}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAccept(app.userId)}
                    >
                      Accept
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Modal for viewing full details */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {selectedApp.applicationTitle || "Rider Application"}
            </h3>

            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p>
                <strong>Name:</strong> {selectedApp.applicantName}
              </p>
              <p>
                <strong>Email:</strong> {selectedApp.applicantEmail}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp.mobileNumber}
              </p>
              <p>
                <strong>District:</strong> {selectedApp.district}
              </p>
              <p>
                <strong>Education:</strong> {selectedApp.education}
              </p>
              <p>
                <strong>Profile Summary:</strong> {selectedApp.profileSummary}
              </p>
              <p>
                <strong>Resume Link:</strong>{" "}
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
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleAccept(selectedApp.userId);
                  setSelectedApp(null);
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
