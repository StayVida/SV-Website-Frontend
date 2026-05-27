import { MapPin, CalendarCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">{booking.hotelName}</CardTitle>
          <CardDescription className="text-xs text-gray-400 font-mono mt-0.5">{booking.id}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {typeof booking.roomNumber === "number" && (
          <div className="flex items-center text-sm text-gray-600 font-medium">
            <MapPin className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
            <span>Room {booking.roomNumber}</span>
          </div>
        )}
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
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 h-10 font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"
          onClick={() => onViewBookingDetails(booking.id)}
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );

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
    </Card>
  );
};
