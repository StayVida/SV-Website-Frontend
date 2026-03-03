import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookingDetails } from "@/api/booking";
import { createRating } from "@/api/hotelsApi";
import { Loader2, ArrowLeft, CheckCircle, Clock, Star, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import HotelReviews from "@/components/hotelDetails/HotelReviews";

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: bookingData, isLoading, error } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingDetails(id!),
    enabled: !!id,
  });

  const { mutate: submitReview, isPending: isSubmitting } = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      toast.success("Thank you for your review!");
      setRating(0);
      setComment("");
      // Invalidate the hotel ratings to show the new review
      if (data?.hotel_ID) {
        queryClient.invalidateQueries({ queryKey: ["hotelRatings", data.hotel_ID] });
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit review. Please try again.");
    },
  });

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    submitReview({
      booking_id: data.booking_ID,
      hotel_id: data.hotel_ID,
      rating_value: rating,
      comment: comment,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500 font-semibold">Failed to load booking details.</p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
    );
  }

  const { data } = bookingData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 hover:bg-gray-100"
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
      </Button>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <CardContent className="p-6 flex items-center gap-4">
            {data.booking_Status === "Confirmed" ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <Clock className="w-12 h-12 text-orange-500" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking {data.booking_Status}
              </h1>
              <p className="text-gray-600">Booking ID: <span className="font-mono font-medium">{data.booking_ID}</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Hotel Details */}
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Property</p>
                <p className="font-semibold text-lg">{data.hotel_name}</p>
                <p className="text-sm text-gray-600">ID: {data.hotel_ID}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Check-In</p>
                  <p className="font-medium">{formatDate(data.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-Out</p>
                  <p className="font-medium">{formatDate(data.checkOut)}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Room Details</p>
                <p className="font-medium">Room {data.RoomNumber}</p>
                <p className="text-sm text-gray-600">Room ID: {data.room_ID}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Price</span>
                <span className="font-medium">₹{data["Room Price"].toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium">₹{data.platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Taxes

                </span>
                <span className="font-medium">{(data.tax_amount * 100).toLocaleString()}%</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{data["gross amount to be paid by customer"].toLocaleString()}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="font-semibold text-green-700">₹{data["amount paid by customer"].toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Amount</span>
                  <span className="font-semibold text-red-600">₹{data["payment left to pay customer"].toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-gray-600">Payment Type</span>
                  <span className="font-medium">{data.payment_type}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Guest Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{data.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{data.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">{data.user_ID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${data.payment_Status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {data.payment_Status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2 mt-8">
            <HotelReviews hotelId={data.hotel_ID} />
          </div>
          {/* Review and Comment Section */}
          <Card className="md:col-span-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Share Your Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">How would you rate your stay?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform active:scale-90 bg-transparent"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                          } transition-colors`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-semibold text-gray-600 self-center">
                      {rating}.0 / 5.0
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                  Your Comment
                </label>
                <Textarea
                  id="comment"
                  placeholder="Tell us about your stay, the service, and the amenities..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                  className="min-h-[120px] bg-white border-primary/10 focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-white/50 border-t p-4 flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Your feedback helps us improve our service.
              </p>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || rating === 0}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Review
              </Button>
            </CardFooter>
          </Card>

          {/* Hotel Reviews at the bottom */}

        </div>
      </div>
    </div>
  );
}
