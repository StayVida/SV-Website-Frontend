import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Check, User, Phone, Loader2, CreditCard, Banknote } from "lucide-react";
import type { Hotel } from "@/types/hotelType";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  lockRoom,
  createBooking,
  createRazorpayOrder,
  verifyRazorpayPayment,
  type LockRoomResponse,
  type CreateBookingResponse
} from "@/api/booking";

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
  const [guestName, setGuestName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>(hotel.onArrivalPayment ? "Local" : "Online");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lockData, setLockData] = useState<LockRoomResponse | null>(null);

  const selectedRoomData = hotel.rooms.find((r: any) => r.id === selectedRoom);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Use price and duration from lockData if available, otherwise fallback to selectedRoomData
  const basePricePerNight = lockData?.roomPrice ?? selectedRoomData?.price ?? 0;
  // stayDuration is not in LockRoomResponse, rely on selectedRoomData or calculation
  const stayDuration = selectedRoomData?.stayDuration ?? 1;
  const taxRate = lockData?.taxRate ?? selectedRoomData?.taxRate ?? 0;
  const platformCharges = lockData?.platformCharges ?? selectedRoomData?.platformCharges ?? 0;

  // lockData.totalPrice might be null initially as per user response example? 
  // actually user response has totalPrice: null. 
  // Let's rely on calculation or createBooking response for final amount.
  // User example for lockRoom details: "totalPrice": null. 
  // User example for createBooking details: "totalAmount": 13736.00.
  // Let's estimate total for display before locking using room data.
  const estimatedTotal = selectedRoomData?.totalAmount ?? 0;

  // Mutation: Lock Room
  const lockRoomMutation = useMutation({
    mutationFn: lockRoom,
    onSuccess: (data) => {
      setLockData(data);
      // Proceed to create booking immediately after locking? 
      // Or just lock when user enters details?
      // The prompt says: "booking hotel first hit .../lock-room ... and get ... data and then hit .../create"
      // This implies a sequence triggered by "Book Now".
    },
    onError: (error: any) => {
      setBookingError(error.message || "Failed to lock room");
    }
  });

  // Mutation: Create Booking
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onError: (error: any) => {
      setBookingError(error.message || "Failed to create booking");
    }
  });

  // Mutation: Razorpay Order
  const razorpayOrderMutation = useMutation({
    mutationFn: createRazorpayOrder,
    onError: (error: any) => {
      setBookingError(error.message || "Failed to create payment order");
    }
  });

  // Mutation: Verify Payment
  const verifyPaymentMutation = useMutation({
    mutationFn: verifyRazorpayPayment,
    onError: (error: any) => {
      setBookingError(error.message || "Payment verification failed");
    }
  });

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

    setBookingError(null);

    try {
      // 1. Lock Room
      const lockResponse = await lockRoomMutation.mutateAsync({
        hotelId: hotel.id,
        roomType: selectedRoomData?.name || "", // Assuming name matches roomType as per user example logic "Deluxe Suite"
        checkIn,
        checkOut
      });

      // 2. Create Booking
      const bookingResponse = await createBookingMutation.mutateAsync({
        lockRoomId: lockResponse.roomId, // User example: "roomId": "2NJK" mapped to lockRoomId
        adults: parseInt(adults),
        children: parseInt(children),
        paymentType: paymentMethod === "Online" ? "Advance" : "Pay at Hotel", // Adjust mapping if needed
        name: guestName,
        countryCode: "+91", // Hardcoded for now or add input
        phoneNo: phoneNumber,
        checkIn,
        checkOut
      });

      if (paymentMethod === "Local") {
        setBookingSuccess(true);
        setTimeout(() => {
          navigate(`/booking/${bookingResponse.bookingId}`);
        }, 1500);
        return;
      }

      // 3. Online Payment (Razorpay)
      // Calculate amount: User query says createBooking returns "totalAmount_ADV": 4286.00
      // And then hit razorpay/order with that amount.
      const amountToPay = bookingResponse.totalAmount_ADV;

      const orderResponse = await razorpayOrderMutation.mutateAsync({
        bookingId: bookingResponse.bookingId,
        amount: amountToPay
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: hotel.name,
        description: `Booking for ${selectedRoomData?.name}`,
        order_id: orderResponse.razorpayOrderId,
        handler: async (response: any) => {
          await verifyPaymentMutation.mutateAsync({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });

          setBookingSuccess(true);
          setTimeout(() => {
            navigate(`/booking/${bookingResponse.bookingId}`);
          }, 1500);
        },
        prefill: {
          name: guestName,
          contact: phoneNumber,
          email: authData.user.email
        },
        theme: {
          color: "#166534"
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (err: any) {
      console.error("Booking detailed error:", err);
      // Error handling is managed by mutation onError
    }
  };

  const isProcessing = lockRoomMutation.isPending || createBookingMutation.isPending || razorpayOrderMutation.isPending || verifyPaymentMutation.isPending;

  // Update payment method if hotel config changes
  useEffect(() => {
    if (!hotel.onArrivalPayment && paymentMethod === "Local") {
      setPaymentMethod("Online");
    }
  }, [hotel.onArrivalPayment]);

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
                  value={checkIn}
                  readOnly
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={checkOut}
                  readOnly
                  className="pl-10"
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
              <span className="font-medium">{taxRate * 100}%</span>
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
              <span>₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Payment Method</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={!hotel.onArrivalPayment}
                onClick={() => setPaymentMethod("Local")}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all w-full",
                  paymentMethod === "Local"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : !hotel.onArrivalPayment
                      ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
                      : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                )}
              >
                <Banknote className={cn("mb-3 h-6 w-6",
                  paymentMethod === "Local" ? "text-green-600" : !hotel.onArrivalPayment ? "text-gray-300" : "text-gray-800"
                )} />
                <span className="text-sm font-medium">Pay at Hotel</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Online")}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all w-full",
                  paymentMethod === "Online"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                )}
              >
                <CreditCard className={cn("mb-3 h-6 w-6",
                  paymentMethod === "Online" ? "text-green-600" : "text-gray-800"
                )} />
                <span className="text-sm font-medium">Pay Online</span>
              </button>
            </div>
            {!hotel.onArrivalPayment && (
              <p className="text-xs text-gray-500 italic">"Pay at Hotel" is not available for this property.</p>
            )}
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
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold mb-4"
            >
              {isProcessing ? (
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
