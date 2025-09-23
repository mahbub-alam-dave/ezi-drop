"use client";
import React, { useState, useMemo, useEffect } from "react";
import axios from 'axios';

export default function Review() {
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch reviews from the database using axios
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 🔹 Average Rating + Count
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // 🔹 Filter reviews based on rating
  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === Number(filter));

  // 🔹 Review card
  const ReviewCard = ({ review }) => (
    <div className="p-3 sm:p-4 rounded-lg mx-2 sm:mx-3 shadow hover:shadow-lg transition-all duration-200 
      w-56 sm:w-60 md:w-72 lg:w-80 shrink-0 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
      <div className="flex gap-2 items-center">
        <img
          className="size-9 sm:size-10 md:size-11 rounded-full border-2 border-[var(--color-primary)]"
          src={review.image}
          alt="User Avatar"
        />
        <div>
          <p className="font-medium text-xs sm:text-sm md:text-base text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            {review.name}
          </p>
          <div className="flex text-yellow-400 text-[10px] sm:text-xs md:text-sm">
            {"⭐".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>
        </div>
      </div>
      <p className="text-[11px] sm:text-xs md:text-sm py-2 sm:py-3 md:py-4 text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
        “{review.comment}”
      </p>
      <p className="text-[10px] sm:text-xs text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
        Posted on {review.date}
      </p>
    </div>
  );

  if (loading) {
    return (
      <section className="w-full py-10 sm:py-14 md:py-16 text-center dark:bg-[var(--color-bg-light-dark)]">
        <p className="text-xl text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading reviews...</p>
      </section>
    );
  }

  return (
    <div>
      <section className="w-full py-10 sm:py-14 md:py-16 dark:bg-[var(--color-bg-light-dark)]">
        {/* 🔹 CSS for marquee animation */}
        <style>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .marquee-inner {
            animation: marqueeScroll 25s linear infinite;
          }
          .marquee-reverse {
            animation-direction: reverse;
          }
        `}</style>

        {/* 🔹 Section Title */}
        <div className="text-center pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8 px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
            What Our Customers Say
          </h2>
          <p className="text-[11px] sm:text-xs md:text-base text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)] mt-2">
            Real feedback from our happy customers
          </p>
          <div className="mt-3 sm:mt-4 w-14 sm:w-20 md:w-24 h-1 bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] mx-auto rounded-full"></div>

          {/* 🔹 Average Rating */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm sm:text-base">
            <p className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              ⭐ {avgRating} / 5
            </p>
            <p className="text-[var(--color-text-soft)] dark:text-[var(--color-text-soft-dark)]">
              Based on {reviews.length} reviews
            </p>
          </div>

          {/* 🔹 Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["all", 5, 4, 3, 2, 1].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full border text-xs sm:text-sm ${
                  filter === f
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text)] dark:text-[var(--color-text-dark)] border-gray-300 dark:border-gray-600"
                }`}
              >
                {f === "all" ? "All" : `${f} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Marquee Row 1 */}
        <div className="marquee-row w-full max-w-[1440px] mx-auto overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-8 sm:w-14 md:w-20 z-10 pointer-events-none bg-gradient-to-r from-[var(--color-bg)] dark:from-[var(--color-bg-dark)] to-transparent"></div>
          <div className="marquee-inner flex transform-gpu min-w-[200%] pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5">
            {[...filteredReviews, ...filteredReviews].map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-8 sm:w-14 md:w-20 lg:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--color-bg)] dark:from-[var(--color-bg-dark)] to-transparent"></div>
        </div>

        {/* 🔹 Marquee Row 2 (Reverse scroll) */}
        <div className="marquee-row w-full mx-auto max-w-[1440px] overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-8 sm:w-14 md:w-20 z-10 pointer-events-none bg-gradient-to-r from-[var(--color-bg)] dark:from-[var(--color-bg-dark)] to-transparent"></div>
          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5">
            {[...filteredReviews, ...filteredReviews].map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-8 sm:w-14 md:w-20 lg:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--color-bg)] dark:from-[var(--color-bg-dark)] to-transparent"></div>
        </div>
      </section>
    </div>
  );
}
