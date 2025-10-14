"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { Star } from "lucide-react";

export default function ReviewModal({ riderId, userId }) {
  const [appReviewDone, setAppReviewDone] = useState(false);
  const [riderReview, setRiderReview] = useState("");
  const [riderRating, setRiderRating] = useState(0);
  const [appReview, setAppReview] = useState("");
  const [appRating, setAppRating] = useState(0);

  const handleSubmit = async () => {
    try {
      // 🧩 1️⃣ Rider Review
      await fetch("/api/rider-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riderId,
          reviewerId: userId,
          review: riderReview,
          rating: riderRating,
        }),
      });

      // 🧩 2️⃣ App Review
      if (!appReviewDone && appReview.trim()) {
        await fetch("/api/app-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            review: appReview,
            rating: appRating,
          }),
        });
        setAppReviewDone(true);
      }

      Swal.fire("✅ Thank You!", "Your review has been submitted.", "success");
      setRiderReview("");
      setAppReview("");
      setRiderRating(0);
      setAppRating(0);
    } catch (error) {
      Swal.fire("❌ Error", "Failed to submit review", "error");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-lg mx-auto">
      {/* App Review Section */}
      {!appReviewDone && (
        <div className="mb-6 border-b pb-4">
          <h3 className="font-semibold mb-2 text-lg">⭐ Review Our App</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setAppRating(star)}
                className={`cursor-pointer ${
                  star <= appRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            className="w-full border rounded p-2"
            rows="3"
            value={appReview}
            onChange={(e) => setAppReview(e.target.value)}
            placeholder="Write your app review..."
          />
        </div>
      )}

      {/* Rider Review Section */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">🚴 Review Rider</h3>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => setRiderRating(star)}
              className={`cursor-pointer ${
                star <= riderRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
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
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
      >
        Submit Review
      </button>
    </div>
  );
}
