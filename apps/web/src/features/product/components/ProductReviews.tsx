"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitProductReview } from "@/services";
import type { Product, Review } from "@/shared/types";

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export default function ProductReviews({
  productId,
  reviews,
  averageRating,
  reviewCount,
  setReviews,
  setProduct,
}: ProductReviewsProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    userName: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      const newReview = await submitProductReview(productId, {
        rating: reviewData.rating,
        title: reviewData.userName
          ? `${reviewData.userName}'s Review`
          : undefined,
        comment: reviewData.comment,
      });

      if (newReview) {
        setReviews((prev) => [newReview, ...prev]);
        setReviewData({ userName: "", email: "", rating: 5, comment: "" });
        setShowReviewModal(false);
        alert("Review submitted successfully!");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
        <button
          onClick={() => setShowReviewModal(true)}
          className="bg-[#7c3aed] text-white px-6 py-2.5 rounded-lg hover:bg-[#6d28d9] transition-colors font-medium shadow-md"
        >
          Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <div className="flex items-center space-x-6 mb-6">
            <div className="text-5xl font-bold text-gray-900">
              {averageRating?.toFixed(1) || "0.0"}
            </div>
            <div>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${i < Math.floor(averageRating || 0) ? "fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                {reviewCount === 0
                  ? "No reviews yet"
                  : `Based on ${reviewCount} review${reviewCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const ratingCount = reviews.filter(
                (r) => r.rating === rating,
              ).length;
              const percentage =
                reviews.length > 0 ? (ratingCount / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 w-10 font-medium">
                    {rating}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {ratingCount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-3 font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-8 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              {review.title && (
                <h5 className="font-semibold text-gray-900 mb-2 text-base">
                  {review.title}
                </h5>
              )}
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewData.userName}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, userName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className={`text-2xl ${rating <= reviewData.rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 h-32"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 bg-[#EB6426] text-white py-2 rounded-lg hover:bg-[#d55a21] disabled:bg-gray-400"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
