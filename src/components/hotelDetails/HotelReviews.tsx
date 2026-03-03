import { useQuery } from "@tanstack/react-query";
import { Star, User, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { getHotelRatings } from "@/api/hotelsApi";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface HotelReviewsProps {
  hotelId: string;
}

export default function HotelReviews({ hotelId }: HotelReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotelRatings", hotelId],
    queryFn: () => getHotelRatings(hotelId),
    enabled: !!hotelId,
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
              }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 min-w-[350px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null; // Or show a silent error
  }

  const reviews = data.ratings || [];
  const averageRating = data.averageRating || (reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating_Value, 0) / reviews.length : 0);

  if (reviews.length === 0) {
    return (
      <Card className="bg-gray-50/50 border-dashed border-2 py-12">
        <CardContent className="flex flex-col items-center justify-center gap-3">
          <MessageSquare className="w-12 h-12 text-gray-300" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 py-8 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
              {averageRating.toFixed(1)}
            </div>
            <span className="text-sm font-medium text-gray-700">Excellent</span>
            <span className="text-sm text-gray-500">• {reviews.length} reviews</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full hover:bg-white hover:shadow-md transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full hover:bg-white hover:shadow-md transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review) => (
          <Card
            key={review.rating_ID}
            className="min-w-[320px] md:min-w-[400px] snap-start hover:shadow-lg transition-shadow duration-300 border-gray-100"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold overflow-hidden uppercase">
                    {review.user_Name ? review.user_Name.charAt(0) : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.user_Name || `User #${review.user_ID}`}</h4>
                    <p className="text-xs text-gray-500">{formatDate(review.rated_at)}</p>
                  </div>
                </div>
                {renderStars(review.rating_Value)}
              </div>

              <div className="relative">
                <span className="text-4xl text-blue-100 absolute -top-4 -left-2 font-serif">"</span>
                <p className="text-gray-700 leading-relaxed relative z-10 italic">
                  {review.comment || "Great experience, highly recommended!"}
                </p>
              </div>

              {review.booking_ID && (
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                  <span className="uppercase tracking-wider">Verified Booking</span>
                  <span className="font-mono">{review.booking_ID}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
