import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Check, User, Phone } from "lucide-react";
import type { Hotel } from "@/types/hotelType";

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
  const [checkInDate, setCheckInDate] = useState<string>(checkIn || "");
  const [checkOutDate, setCheckOutDate] = useState<string>(checkOut || "");
  const [guestName, setGuestName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const selectedRoomData = hotel.rooms.find((r) => r.id === selectedRoom);
  const basePrice: number = selectedRoomData?.price ?? hotel.pricePerNight;
  const taxes: number = Math.round(basePrice * 0.12);
  const platformCharges: number = 199;
  const totalPrice: number = basePrice + taxes + platformCharges;

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
              <span className="font-medium">₹{basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Taxes</span>
              <span className="font-medium">₹{taxes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Platform Charges</span>
              <span className="font-medium">₹{platformCharges}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold mb-4">
            Book Now
          </Button>

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
