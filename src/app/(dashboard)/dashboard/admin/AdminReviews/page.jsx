"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, usersRes] = await Promise.all([
        fetch("/api/reviews"),
        fetch("/api/users"),
      ]);
      setReviews(await reviewsRes.json());
      setUsers(await usersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      let method = action === "delete" ? "DELETE" : "PATCH";

      const res = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Stats for stackable cards
  const totalUsers = users.length;
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-6">
      {/* Top Navbar */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Admin Reviews </h1>
        <button
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Refresh
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded-xl flex flex-col items-center">
          <p className="text-gray-400">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl flex flex-col items-center">
          <p className="text-gray-400">Total Reviews</p>
          <p className="text-2xl font-bold">{totalReviews}</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl flex flex-col items-center">
          <p className="text-gray-400">Pending Reviews</p>
          <p className="text-2xl font-bold">{pendingReviews}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        {loading ? (
          <p className="text-gray-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400">No reviews found.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 bg-gray-800 rounded-xl flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={rev.photo || "/default-avatar.png"}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{rev.name}</p>
                    <p className="text-gray-400 text-sm">{rev.email}</p>
                  </div>
                </div>
                <p className="text-gray-300">{rev.comment}</p>
                <p className="text-yellow-400 font-semibold">{rev.rating}⭐</p>
                <div className="flex gap-2 mt-2">
                  {rev.status === "pending" && (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                        onClick={() => handleAction(rev._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                        onClick={() => handleAction(rev._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
                    onClick={() => handleAction(rev._id, "delete")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 p-4 rounded-xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
