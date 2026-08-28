import { MapPin, CalendarCheck, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createRazorpayOrder, verifyRazorpayPayment, cancelBooking as cancelBookingApi } from "@/api/booking";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export interface Booking {
  id: string;
  hotelName: string;
  roomNumber?: number;
  checkIn?: string;
  checkOut?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  paymentLeft?: number;
  grossAmount?: number;
}

interface PreviousBookingsProps {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  onViewBookingDetails: (bookingId: string) => void;
}

export const PreviousBookings = ({
  bookings,
  isLoading,
  error,
  onViewBookingDetails,
}: PreviousBookingsProps) => {
  const { authData } = useAuth();
  const [repayBookingId, setRepayBookingId] = useState<string | null>(null);
  const [cancelingBooking, setCancelingBooking] = useState<Booking | null>(null);

  const cancelMutation = useMutation({
    mutationFn: cancelBookingApi,
    onSuccess: () => {
      alert("Booking cancelled successfully.");
      window.location.reload();
    },
    onError: (error: any) => {
      alert(error.message || "Failed to cancel booking.");
      setCancelingBooking(null);
    }
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const razorpayOrderMutation = useMutation({
    mutationFn: createRazorpayOrder,
    onError: (error: any) => {
      alert(error.message || "Failed to create payment order");
      setRepayBookingId(null);
    }
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyRazorpayPayment,
    onError: (error: any) => {
      alert(error.message || "Payment verification failed");
      setRepayBookingId(null);
    }
  });

  const handleRepay = async (booking: Booking) => {
    const amountToPay = booking.paymentLeft || booking.grossAmount;
    if (!amountToPay) return;
    setRepayBookingId(booking.id);

    try {
      const orderResponse = await razorpayOrderMutation.mutateAsync({
        bookingId: booking.id,
        amount: amountToPay
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: booking.hotelName,
        description: `Repayment for Booking ${booking.id}`,
        order_id: orderResponse.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            alert("Payment successful! Reloading...");
            window.location.reload();
          } catch (e) {
            console.error(e);
          } finally {
            setRepayBookingId(null);
          }
        },
        prefill: {
          name: authData?.user?.name || "",
          contact: authData?.user?.phoneNumber || "",
          email: authData?.user?.email || ""
        },
        theme: {
          color: "#166534"
        },
        modal: {
          ondismiss: () => setRepayBookingId(null)
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (e) {
      console.error(e);
      setRepayBookingId(null);
    }
  };

  const isRepaying = razorpayOrderMutation.isPending || verifyPaymentMutation.isPending;

  const renderBookingCard = (booking: Booking) => {
    const canCancel = booking.bookingStatus?.toLowerCase() !== "cancelled" && booking.bookingStatus?.toLowerCase() !== "checkedout";
    
    return (
    <Card key={booking.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">{booking.hotelName}</CardTitle>
          <CardDescription className="text-xs text-gray-400 font-mono mt-0.5">{booking.id}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room number hidden as per request */}
        <div className="flex items-start text-sm text-gray-600">
          <CalendarCheck className="mr-2 h-4.5 w-4.5 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold text-gray-700">Check-in: <span className="font-normal text-gray-600">{booking.checkIn ?? "—"}</span></span>
            <span className="hidden sm:inline-block text-gray-300 font-normal">•</span>
            <span className="font-semibold text-gray-700">Check-out: <span className="font-normal text-gray-600">{booking.checkOut ?? "—"}</span></span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm pt-1">
          <span className={`capitalize font-bold px-2.5 py-1 rounded-full text-xs border ${
            booking.bookingStatus?.toLowerCase() === "checkedout"
              ? "bg-green-50 text-green-700 border-green-200"
              : booking.bookingStatus?.toLowerCase() === "confirmed"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          }`}>
            {booking.bookingStatus ?? "—"}
          </span>
          <span className={`capitalize font-bold text-xs ${
            booking.paymentStatus?.toLowerCase() === "pending"
              ? "text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200"
              : "text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200"
          }`}>
            Payment: {booking.paymentStatus ?? "—"}
          </span>
        </div>
        {(typeof booking.grossAmount === "number" || typeof booking.paymentLeft === "number") && (
          <div className="flex items-center justify-between text-sm text-gray-700 border-t border-gray-100 pt-3 mt-1">
            {typeof booking.grossAmount === "number" && (
              <span className="font-medium text-gray-600">Total: <span className="font-bold text-gray-900">₹{booking.grossAmount.toLocaleString()}</span></span>
            )}
            {typeof booking.paymentLeft === "number" && (
              <span className="font-medium text-gray-600">Due: <span className="font-bold text-red-600">₹{booking.paymentLeft.toLocaleString()}</span></span>
            )}
          </div>
        )}
        <div className="flex gap-2 w-full mt-2">
          {booking.paymentStatus?.toLowerCase() === "failed" && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-10 font-semibold flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleRepay(booking)}
              disabled={isRepaying && repayBookingId === booking.id}
            >
              {isRepaying && repayBookingId === booking.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Repay"
              )}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => setCancelingBooking(booking)}
              disabled={cancelMutation.isPending && cancelingBooking?.id === booking.id}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"
            onClick={() => onViewBookingDetails(booking.id)}
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Previous bookings</CardTitle>
        <CardDescription>Your most recent stay history and trip details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500 font-medium animate-pulse">Loading your booking history…</div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-8 text-center text-gray-500 font-medium">Previous history is not available.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.slice(0, 3).map((booking) => renderBookingCard(booking))}
          </div>
        )}
      </CardContent>

      {cancelingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Cancel Booking</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">Are you sure you want to cancel your booking for <strong className="text-gray-900">{cancelingBooking.hotelName}</strong>?</p>
              
              {(() => {
                 if (!cancelingBooking.checkIn) return null;
                 const checkInDate = new Date(cancelingBooking.checkIn);
                 checkInDate.setHours(12, 0, 0, 0); 
                 const hoursDiff = (checkInDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
                 const isEligible = hoursDiff >= 24;

                 return (
                   <div className={`p-3 rounded-md text-sm border ${isEligible ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                     {isEligible ? (
                       <span><strong>Refund Eligible:</strong> Since you are cancelling more than 24 hours before check-in, any paid amount will be refunded to your StayVida Wallet.</span>
                     ) : (
                       <span><strong>No Refund:</strong> Since you are cancelling within 24 hours of check-in, you are not eligible for a refund.</span>
                     )}
                   </div>
                 )
              })()}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <Button variant="outline" onClick={() => setCancelingBooking(null)} disabled={cancelMutation.isPending}>Keep Booking</Button>
              <Button variant="destructive" onClick={() => cancelMutation.mutate(cancelingBooking.id)} disabled={cancelMutation.isPending}>
                {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
