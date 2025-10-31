"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from 'axios';

// 🎯 Sub-components for better organization
const ReviewCard = ({ review }) => (
  <div className="group p-4 sm:p-5 rounded-xl mx-2 sm:mx-3 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
    w-56 sm:w-64 md:w-72 lg:w-80 shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
    <div className="flex gap-3 items-start">
      <img
        className="size-10 sm:size-12 md:size-14 rounded-full border-2 border-indigo-500 object-cover"
        src={review.image || "/placeholder-avatar.jpg"}
        alt={`${review.name}'s avatar`}
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">
          {review.name}
        </p>
        <div className="flex mt-1 text-yellow-400">
          {"⭐".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
      </div>
    </div>
    <p className="text-xs sm:text-sm md:text-base mt-3 leading-relaxed text-gray-600 dark:text-gray-300 italic">
      “{review.comment}”
    </p>
    <p className="text-[10px] sm:text-xs mt-2 text-gray-500 dark:text-gray-400">
      {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </p>
  </div>
);

const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    }`}
  >
    {label}
  </button>
);

const LoadingSkeleton = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">🫤</div>
    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No reviews yet</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Be the first to leave a review!</p>
  </div>
);

// 🎨 Main Component
export default function Review() {
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const marqueeRefs = useRef([]);

  // 🔄 Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews');
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 📊 Average Rating
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // 🔍 Filtered Reviews
  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter((r) => r.rating === Number(filter));
  }, [reviews, filter]);

  // 🌀 Marquee logic with pause on hover
  useEffect(() => {
    const handleMouseEnter = (index) => {
      if (marqueeRefs.current[index]) {
        marqueeRefs.current[index].style.animationPlayState = 'paused';
      }
    };

    const handleMouseLeave = (index) => {
      if (marqueeRefs.current[index]) {
        marqueeRefs.current[index].style.animationPlayState = 'running';
      }
    };

    marqueeRefs.current.forEach((ref, idx) => {
      if (ref) {
        ref.addEventListener('mouseenter', () => handleMouseEnter(idx));
        ref.addEventListener('mouseleave', () => handleMouseLeave(idx));
      }
    });

    return () => {
      marqueeRefs.current.forEach((ref, idx) => {
        if (ref) {
          ref.removeEventListener('mouseenter', () => handleMouseEnter(idx));
          ref.removeEventListener('mouseleave', () => handleMouseLeave(idx));
        }
      });
    };
  }, [filteredReviews]);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <LoadingSkeleton />
      </section>
    );
  }

  return (
  
    <section className="w-full py-16 px-4 sm:px-6 md:px-8 relative overflow-hidden">
  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 -z-10"></div>

  {/* 🎯 Inject marquee styles */}
  <style jsx>{`
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      animation: marqueeScroll 35s linear infinite;
    }
    .marquee-reverse {
      animation-direction: reverse;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
  `}</style>

  {/* 📌 Header Section */}
  <div className="max-w-5xl mx-auto text-center mb-12 relative z-10">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
      Customer Love ❤️
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
      Real stories from people who’ve experienced our service firsthand.
    </p>

    {/* 🌟 Rating Summary */}
    <div className="mt-6 inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-slate-700">
      <span className="text-lg font-bold text-yellow-500">⭐ {avgRating}</span>
      <span className="text-gray-600 dark:text-gray-300">from {reviews.length} reviews</span>
    </div>

    {/* 🎚️ Filter Buttons */}
    <div className="flex flex-wrap justify-center gap-2 mt-8">
      {["all", 5, 4, 3, 2, 1].map((f) => (
        <FilterButton
          key={f}
          label={f === "all" ? "All Reviews" : `${f} Stars`}
          isActive={filter === f}
          onClick={() => setFilter(f)}
        />
      ))}
    </div>
  </div>

  {/* ❗ Empty State */}
  {filteredReviews.length === 0 && !loading && <EmptyState />}

  {/* 🌀 Marquee Rows */}
  {filteredReviews.length > 0 && (
    <>
      {/* Row 1 */}
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden mb-8 group">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent dark:from-slate-900 pointer-events-none z-10"></div>
        <div
          ref={el => marqueeRefs.current[0] = el}
          className="marquee-track flex gap-4 min-w-[200%] py-4 px-4"
        >
          {[...filteredReviews, ...filteredReviews].map((review, index) => (
            <ReviewCard key={`row1-${index}`} review={review} />
          ))}
        </div>
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-indigo-50 to-transparent dark:from-slate-900 pointer-events-none z-10"></div>
      </div>

      {/* Row 2 (Reverse) */}
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-indigo-50 to-transparent dark:from-slate-900 pointer-events-none z-10"></div>
        <div
          ref={el => marqueeRefs.current[1] = el}
          className="marquee-track marquee-reverse flex gap-4 min-w-[200%] py-4 px-4"
        >
          {[...filteredReviews, ...filteredReviews].map((review, index) => (
            <ReviewCard key={`row2-${index}`} review={review} />
          ))}
        </div>
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-indigo-50 to-transparent dark:from-slate-900 pointer-events-none z-10"></div>
      </div>
    </>
  )}
</section>

  );
}