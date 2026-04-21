"use client";

import { useState, useMemo } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  ImageIcon,
} from "lucide-react";
import { Review } from "../types";
import { manrope, public_sans } from "@/app/fonts";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

type SortOption =
  | "most-recent"
  | "most-helpful"
  | "highest-rated"
  | "lowest-rated";

export default function ReviewsSection({
  reviews,
  averageRating,
  reviewCount,
}: ReviewsSectionProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("most-recent");
  const [filterByRating, setFilterByRating] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<
    Record<string, { yes: number; no: number }>
  >({});
  const [userVoted, setUserVoted] = useState<Record<string, "yes" | "no">>({});
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    if (filterByRating) {
      result = result.filter((r) => r.rating === filterByRating);
    }

    switch (sortBy) {
      case "most-recent":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "most-helpful":
        result.sort((a, b) => {
          const aVotes =
            (helpfulVotes[a.id]?.yes || 0) - (helpfulVotes[a.id]?.no || 0);
          const bVotes =
            (helpfulVotes[b.id]?.yes || 0) - (helpfulVotes[b.id]?.no || 0);
          return bVotes - aVotes;
        });
        break;
      case "highest-rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest-rated":
        result.sort((a, b) => a.rating - b.rating);
        break;
    }
    return result;
  }, [reviews, sortBy, filterByRating, helpfulVotes]);

  const handleVote = (reviewId: string, vote: "yes" | "no") => {
    if (userVoted[reviewId]) return;

    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: {
        yes:
          vote === "yes"
            ? (prev[reviewId]?.yes || 0) + 1
            : prev[reviewId]?.yes || 0,
        no:
          vote === "no"
            ? (prev[reviewId]?.no || 0) + 1
            : prev[reviewId]?.no || 0,
      },
    }));
    setUserVoted((prev) => ({ ...prev, [reviewId]: vote }));
  };

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const hasReviews = reviews.length > 0;
  const reviewText =
    reviewCount === 0
      ? "No reviews yet"
      : `Based on ${reviewCount} review${reviewCount !== 1 ? "s" : ""}`;

  return (
    <div className={`bg-gray-50 rounded-xl shadow-lg p-6 md:p-8 ${manrope.className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className={`text-xl md:text-3xl font-bold text-gray-900 ${public_sans.className}`}>
          Customer Reviews & Rating
        </h2>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 border-b border-gray-200 pb-8">
        <div className="md:col-span-4 flex items-start gap-6">
          <div className={`text-2xl font-bold text-gray-900 leading-none ${public_sans.className}`}>
            {averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? "fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className={`text-gray-800 text-sm ${public_sans.className}`}>{reviewText}</p>
          </div>
        </div>

        <div className="md:col-span-8">
          {hasReviews ? (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = (count / reviews.length) * 100;
                const isActive = filterByRating === rating;
                return (
                  <button
                    key={rating}
                    onClick={() => setFilterByRating(isActive ? null : rating)}
                    className={`flex items-center w-full gap-3 group ${isActive ? "bg-blue-50 -mx-2 px-2 rounded" : ""}`}
                  >
                    <span className="text-sm text-gray-700 w-8 font-medium flex items-center gap-1">
                      {rating}{" "}
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-[#0071dc] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {count}
                    </span>
                  </button>
                );
              })}
              {filterByRating && (
                <button
                  onClick={() => setFilterByRating(null)}
                  className="text-sm text-[#0071dc] hover:underline mt-2"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm">
              Rating breakdown will appear when reviews are added
            </div>
          )}
        </div>
      </div>

      {hasReviews && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className={`text-gray-700 font-medium ${public_sans.className}`}>
            {filteredAndSortedReviews.length} review
            {filteredAndSortedReviews.length !== 1 ? "s" : ""}
            {filterByRating &&
              ` with ${filterByRating} star${filterByRating !== 1 ? "s" : ""}`}
          </p>
        
        </div>
      )}

      <div className="space-y-6">
        {!hasReviews ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-xl">
            <p className="text-xl mb-2 font-medium">No reviews yet</p>
            <p className="text-sm mb-4">Be the first to share your thoughts!</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-[#0071dc] hover:underline font-medium"
            >
              Write a review
            </button>
          </div>
        ) : (
          filteredAndSortedReviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = (review.comment?.length || 0) > 300;
            const votes = helpfulVotes[review.id] || { yes: 0, no: 0 };
            const totalVotes = votes.yes + votes.no;

            return (
              <div
                key={review.id}
                className={`flex flex-col gap-4 border-b border-gray-200 pb-6 last:border-b-0 `}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0071dc] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {review.userName}
                      </span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h5 className="font-semibold text-gray-900 mb-2 text-base">
                    {review.title}
                  </h5>
                )}

                <p
                  className={`text-gray-700 leading-relaxed ${!isExpanded && shouldTruncate ? "line-clamp-3" : ""}`}
                >
                  {review.comment}
                </p>

                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="text-[#0071dc] hover:underline text-sm font-medium mt-1"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden cursor-pomanrope hover:opacity-80"
                      >
                        <img
                          src={img}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm text-gray-600">
                    Was this helpful?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(review.id, "yes")}
                      disabled={!!userVoted[review.id]}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        userVoted[review.id] === "yes"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{votes.yes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(review.id, "no")}
                      disabled={!!userVoted[review.id]}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        userVoted[review.id] === "no"
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{votes.no}</span>
                    </button>
                  </div>
                  {totalVotes > 0 && (
                    <span className="text-xs text-gray-500">
                      ({totalVotes} found this helpful)
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Write a Review
              </h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedRating(0);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Overall rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedRating(rating)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          rating <= selectedRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRating === 0 && "Select a rating"}
                  {selectedRating === 1 && "Poor"}
                  {selectedRating === 2 && "Fair"}
                  {selectedRating === 3 && "Good"}
                  {selectedRating === 4 && "Very Good"}
                  {selectedRating === 5 && "Excellent"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Add a headline *
                </label>
                <input
                  type="text"
                  placeholder="What's most important to know?"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071dc] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your review *
                </label>
                <textarea
                  rows={5}
                  placeholder="What did you like or dislike? Who would you recommend this to?"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0071dc] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Add photos (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pomanrope hover:border-[#0071dc] transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload photos
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your name *
                </label>
                <input
                  type="text"
                  placeholder="How should we call you?"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071dc] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0071dc] text-white py-3 rounded-lg hover:bg-[#0056b3] transition-colors font-medium text-lg"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
