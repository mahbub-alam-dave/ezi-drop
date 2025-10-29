"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function ReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      Swal.fire("Login Required", "Please login to add a review", "warning");
      return;
    }

    const newReview = {
      userId: session.user.email,
      name: session.user.name,
      photo: session.user.image,
      rating,
      comment,
      type: "project",
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Your review has been added!", "success");
        setReviews((prev) => [newReview, ...prev]);
        setComment("");
        setRating(0);
      } else {
        Swal.fire("Error", data.error || "Failed to add review", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
        Loading reviews...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
      <h2 className="text-3xl font-bold text-center">Project Reviews</h2>

      {/* Average Rating */}
      <div className="text-center border border-[var(--color-border)] p-6 rounded-2xl bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
        <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
          Average Rating
        </p>
        <div className="flex justify-center gap-1 my-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-400"
              }`}
              fill={i < Math.round(avgRating) ? "currentColor" : "none"}
            />
          ))}
        </div>
        <p className="font-semibold">{avgRating} / 5 ({reviews.length} Reviews)</p>
      </div>

      {/* All Reviews */}
      {/* <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
            No reviews yet.
          </p>
        ) : (
          reviews.map((rev, i) => (
            <div
              key={i}
              className="p-5 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={rev.photo || "/default-avatar.png"}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{rev.name}</p>
                  <p className="text-xs text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                    {new Date(rev.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < rev.rating ? "text-yellow-400" : "text-gray-400"}`}
                    fill={j < rev.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-sm text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div> */}

      {/* Add Review Form */}
      <div className="p-6 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] space-y-4">
        <h3 className="text-xl font-semibold text-center text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Add Your Project Review
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-400"}`}
                fill={i < rating ? "currentColor" : "none"}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
            rows="4"
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]"
          ></textarea>
          <Button
            type="submit"
            className="w-full bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-white hover:brightness-90"
          >
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
