"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial fetch
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

    // Handle actions (delete / accept / reject)
    const handleAction = async (id, action) => {
        try {
            const method = action === "delete" ? "DELETE" : "PATCH";

            const res = await fetch("/api/reviews", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action }),
            });

            const data = await res.json();

            if (data.success) {
                if (action === "delete") {
                    // Remove review from UI
                    setReviews((prev) => prev.filter((rev) => rev._id !== id));
                } else {
                    // Update status in UI
                    setReviews((prev) =>
                        prev.map((rev) =>
                            rev._id === id ? { ...rev, status: action } : rev
                        )
                    );
                }
            } else {
                alert(data.message || "Action failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };

    // Stats
    const totalUsers = users.length;
    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter((r) => r.status === "pending").length;

    return (
        <div className="min-h-screen p-4 space-y-6 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            {/* Top Navbar */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold">Admin Reviews</h1>
                <button
                    onClick={fetchData}
                    className="bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] hover:brightness-90 px-4 py-2 rounded text-white"
                >
                    Refresh
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl flex flex-col items-center border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">Total Users</p>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="p-4 rounded-2xl flex flex-col items-center border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">Total Reviews</p>
                    <p className="text-2xl font-bold">{totalReviews}</p>
                </div>
                <div className="p-4 rounded-2xl flex flex-col items-center border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">Pending Reviews</p>
                    <p className="text-2xl font-bold">{pendingReviews}</p>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Reviews</h2>
                {loading ? (
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">No reviews found.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((rev) => (
                            <div
                                key={rev._id}
                                className="p-4 rounded-2xl flex flex-col gap-2 border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={rev.photo || "/default-avatar.png"}
                                        alt={rev.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{rev.name}</p>
                                        <p className="text-xs text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">{rev.email}</p>
                                    </div>
                                </div>
                                <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">{rev.comment}</p>
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
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">No users found.</p>
                ) : (
                    <div className="overflow-x-auto p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
                        <table className="min-w-full divide-y divide-[var(--color-border)]">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-4 py-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{user.name}</td>
                                        <td className="px-4 py-2 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">{user.email}</td>
                                        <td className="px-4 py-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{user.role}</td>
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
