"use client";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ReviewModal({ riderId, userId }) {
  const [appReviewDone, setAppReviewDone] = useState(false);
  const [riderReview, setRiderReview] = useState("");
  const [appReview, setAppReview] = useState("");

  const handleSubmit = async () => {
    try {
      // Submit rider review
      await fetch("/api/rider-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riderId,
          reviewerId: userId,
          review: riderReview,
        }),
      });

      // Submit app review if not done yet
      if (!appReviewDone && appReview.trim()) {
        await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            review: appReview,
          }),
        });
        setAppReviewDone(true);
      }

      Swal.fire("Thank You!", "Your review has been submitted.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to submit review", "error");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-lg mx-auto">
      {!appReviewDone && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Review Our App</h3>
          <textarea
            className="w-full border rounded p-2"
            rows="3"
            value={appReview}
            onChange={(e) => setAppReview(e.target.value)}
            placeholder="Write your app review..."
          />
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Review Rider</h3>
        <textarea
          className="w-full border rounded p-2"
          rows="3"
          value={riderReview}
          onChange={(e) => setRiderReview(e.target.value)}
          placeholder="Write your rider review..."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
    </div>
  );
}
