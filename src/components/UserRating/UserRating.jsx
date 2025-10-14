"use client";

import { useState, useEffect } from "react";
import { Star as StarIcon } from "lucide-react";
import Swal from "sweetalert2";
import useLoadingSpinner from "@/hooks/useLoadingSpinner";

export default function UserRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);

  
  // 🔄 Backend থেকে রেটিং ফেচ
  useEffect(() => {
    fetch("/api/rating")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRating(data.rating);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ⭐ রেটিং পাঠানো backend-এ
  const handleRating = async (star) => {
    setRating(star);

    const res = await fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: star }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire({
        title: "Thank You! 🎉",
        text: `You rated: ${star} ⭐`,
        icon: "success",
        confirmButtonText: "Close",
<<<<<<< HEAD
        confirmButtonColor: "#facc15", // হলুদ রঙ (matching the star)
=======
        confirmButtonColor: "#facc15",
>>>>>>> 94c1eab5053ca570d9ff7a4594fdb43c572a6acd
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong while submitting your rating.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  if (loading) return useLoadingSpinner;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            size={32}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer transition-transform transform hover:scale-110 ${
              (hover || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {rating === 0
          ? "Click to rate your delivery experience"
          : `You rated: ${rating} ⭐`}
      </p>
    </div>
  );
}
