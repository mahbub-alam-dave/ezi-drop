"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReviewPage({ userId = "u123", riderId = "r567" }) {
  const [rating, setRating] = useState(0);
  const [riderReview, setRiderReview] = useState("");
  const [appReview, setAppReview] = useState("");
  const [alreadyReviewedApp, setAlreadyReviewedApp] = useState(false);

  useEffect(() => {
    // ✅ Check if user already reviewed the app
    fetch(`/api/app-review?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setAlreadyReviewedApp(data.reviewed));
  }, [userId]);

  const handleSubmit = async () => {
    try {
      // --- 1️⃣ Rider Review ---
      const riderRes = await fetch("/api/rider-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riderId,
          reviewerId: userId,
          review: riderReview || "No comment",
        }),
      });

      const riderData = await riderRes.json();
      if (riderData.success) toast.success("✅ Rider review submitted");

      // --- 2️⃣ App Review (only if not already reviewed) ---
      if (!alreadyReviewedApp) {
        const appRes = await fetch("/api/app-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            review: `${appReview} | Rating: ${rating}/5`,
          }),
        });
        const appData = await appRes.json();
        if (appData.success) toast.success("🌟 App review submitted");
        else toast.error(appData.message);
      }

      setRiderReview("");
      setAppReview("");
      setRating(0);
    } catch (error) {
      toast.error("❌ Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Submit Your Review</h2>

      {!alreadyReviewedApp && (
        <div className="mb-6 border-b pb-6">
          <h3 className="font-semibold mb-2">Rate the Application</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            value={appReview}
            onChange={(e) => setAppReview(e.target.value)}
            placeholder="Write your app experience..."
            className="w-full border p-2 rounded-md"
          />
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Rate the Rider</h3>
        <textarea
          value={riderReview}
          onChange={(e) => setRiderReview(e.target.value)}
          placeholder="Write about the rider..."
          className="w-full border p-2 rounded-md"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Submit Review
      </button>
    </div>
  );
}
