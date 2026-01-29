import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Check, User, Phone, Loader2, CreditCard, Banknote } from "lucide-react";
import type { Hotel } from "@/types/hotelType";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import { cn } from "@/lib/utils";

interface BookingSidebarProps {
  hotel: Hotel;
  selectedRoom: string | null;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
}

export default function BookingSidebar({ 
  hotel, 
  selectedRoom, 
  checkIn, 
  checkOut, 
  adults, 
  children 
}: BookingSidebarProps) {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState<string>(checkIn || "");
  const [checkOutDate, setCheckOutDate] = useState<string>(checkOut || "");
  const [guestName, setGuestName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Local");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const selectedRoomData = hotel.rooms.find((r: any) => r.id === selectedRoom);
  
  // Use price and duration from selectedRoomData if available
  const basePricePerNight: number = selectedRoomData?.price ?? 0;
  const stayDuration: number = selectedRoomData?.stayDuration ?? 0;
  const taxRate: number = selectedRoomData?.taxRate ?? 0;
  const platformCharges: number = selectedRoomData?.platformCharges ?? 0;
  const finalTotalPrice: number = selectedRoomData?.totalAmount ?? 0;

  const handleBooking = async () => {
    if (!authData) {
      alert("Please sign in to book a stay");
      return;
    }

    if (!guestName || !phoneNumber) {
      setBookingError("Please fill in all guest information");
      return;
    }

    if (!selectedRoom) {
      setBookingError("Please select a room");
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const bookingPayload = {
        hotelId: hotel.id,
        roomId: selectedRoom,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestName,
        phone_NO: phoneNumber,
        adults: parseInt(adults),
        children: parseInt(children),
        totalAmount: finalTotalPrice,
        paymentMethod: paymentMethod, // "Local" or "Online"
        userID: authData.user.userID
      };

      const response = await fetch(`${API_BASE_URI}${API_ENDPOINTS.CREATE_BOOKING}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_X_API_KEY,
          "Authorization": `Bearer ${authData.token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      setBookingSuccess(true);
      // Wait a bit then redirect to profile
      setTimeout(() => {
        navigate("/profile");
      }, 3000);

    } catch (err: any) {
      setBookingError(err.message || "An error occurred during booking");
      console.error("Booking error:", err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-6">Book Your Stay</h3>

          <div className="space-y-4 mb-6">
            {/* Guest Information */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Guest Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={guestName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestName(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your phone number"
                  type="tel"
                  required
                />
              </div>
            </div>
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={checkInDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckInDate(e.target.value)}
                  className="pl-10"
                  placeholder="01/06/2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={checkOutDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckOutDate(e.target.value)}
                  className="pl-10"
                  placeholder="01/06/2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Persons</label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input value={`${adults} Adults`} readOnly className="pl-10" placeholder="2 Adults" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Input value={`${children} Children`} readOnly placeholder="0 Children" />
              </div>
            </div>
          </div>

          

          {/* Selected Room */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Selected Room</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="relative w-12 h-12 rounded overflow-hidden">
                <img
                  src={selectedRoomData?.images[0] || "/placeholder.svg"}
                  alt="Selected room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-900">{selectedRoomData?.name}</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-700">Price per night</span>
              <span className="font-medium">₹{basePricePerNight.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Taxes</span>
              <span className="font-medium">{taxRate*100}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Stay Duration</span>
              <span className="font-medium">{stayDuration} nights</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Platform Charges</span>
              <span className="font-medium">₹{platformCharges.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{finalTotalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Payment Method</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("Local")}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all",
                  paymentMethod === "Local"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <Banknote className={cn("mb-3 h-6 w-6", paymentMethod === "Local" ? "text-green-600" : "text-gray-400")} />
                <span className="text-sm font-medium">Pay at Hotel</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Online")}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all",
                  paymentMethod === "Online"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <CreditCard className={cn("mb-3 h-6 w-6", paymentMethod === "Online" ? "text-green-600" : "text-gray-400")} />
                <span className="text-sm font-medium">Pay Online</span>
              </button>
            </div>
          </div>

          {bookingError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {bookingError}
            </div>
          )}

          {bookingSuccess ? (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
              <Check className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-lg">Booking Successful!</p>
              <p className="text-sm">Redirecting to your profile...</p>
            </div>
          ) : (
            <Button 
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold mb-4"
            >
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Book Now"
              )}
            </Button>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              <span>Free cancellation up to 24 hours before check-in</span>
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              <span>Secure payment</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
