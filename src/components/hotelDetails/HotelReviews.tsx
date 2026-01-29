import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";

interface Review {
  rating_ID: number;
  user_ID: number;
  hotel_ID: number;
  booking_ID: string;
  rating_Value: number;
  comment: string;
  rated_at: string;
}

interface ReviewsResponse {
  ratings: Review[];
  averageRating: number;
}

interface HotelReviewsProps {
  hotelId: string;
}

export default function HotelReviews({ hotelId }: HotelReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URI}${API_ENDPOINTS.HOTEL_REVIEWS}/${hotelId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_X_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const result: ReviewsResponse = await response.json();

        if (result.ratings && Array.isArray(result.ratings)) {
          setReviews(result.ratings);
          setAverageRating(result.averageRating || 0);
        } else {
          setReviews([]);
          setAverageRating(0);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching reviews");
        setReviews([]);
        setAverageRating(0);
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (hotelId) {
      fetchReviews();
    }
  }, [hotelId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= fullStars
                ? "fill-yellow-400 text-yellow-400"
                : star === fullStars + 1 && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 fill-opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        {averageRating > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? null : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.rating_ID}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      User #{review.user_ID}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.rated_at)}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating_Value)}
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {review.comment}
                </p>
              )}
              {review.booking_ID && (
                <p className="text-xs text-gray-500 mt-3">
                  Booking: {review.booking_ID}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

