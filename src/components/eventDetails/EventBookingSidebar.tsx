import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Phone, Mail } from "lucide-react";

interface Event {
  id: string;
  name: string;
  type: string;
  pricePerEvent: number;
  capacity: number;
}

interface EventBookingSidebarProps {
  event: Event;
  checkIn: string;
  checkOut: string;
  persons: string;
  eventType: string;
}

function EventBookingSidebar({ event, checkIn, checkOut, persons, eventType }: EventBookingSidebarProps) {
  const [bookingData, setBookingData] = useState({
    eventDate: checkIn || "",
    guestCount: persons || "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    specialRequests: "",
  });

  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsBooking(false);
    setBookingSuccess(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingData({
        eventDate: checkIn || "",
        guestCount: persons || "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        specialRequests: "",
      });
    }, 5000);
  };

  const calculateTotal = () => {
    const basePrice = event.pricePerEvent;
    const guestCount = parseInt(bookingData.guestCount) || 0;
    
    // Simple pricing logic - you can customize this
    if (guestCount > event.capacity) {
      return basePrice + ((guestCount - event.capacity) * 500); // Extra charge for over capacity
    }
    
    return basePrice;
  };

  if (bookingSuccess) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Booking Request Sent!
          </h3>
          <p className="text-gray-600 mb-4">
            Thank you for your interest in {event.name}. We'll contact you within 24 hours to confirm your booking.
          </p>
          <div className="text-sm text-gray-500">
            Reference: #{event.id}-{Date.now().toString().slice(-6)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-primary mb-2">
            ₹{event.pricePerEvent.toLocaleString()}
          </div>
          <div className="text-gray-600">per event</div>
          <div className="text-sm text-gray-500 mt-2">
            Capacity: {event.capacity} guests
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <Label htmlFor="eventDate" className="text-sm font-medium text-gray-700 mb-2 block">
              Event Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                required
                value={bookingData.eventDate}
                onChange={handleInputChange}
                className="pl-10 h-10"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="guestCount" className="text-sm font-medium text-gray-700 mb-2 block">
              Number of Guests
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="guestCount"
                name="guestCount"
                type="number"
                required
                min="1"
                max={event.capacity * 2}
                value={bookingData.guestCount}
                onChange={handleInputChange}
                className="pl-10 h-10"
                placeholder="Enter guest count"
              />
            </div>
            {parseInt(bookingData.guestCount) > event.capacity && (
              <p className="text-amber-600 text-xs mt-1">
                Guest count exceeds recommended capacity. Additional charges may apply.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="contactName" className="text-sm font-medium text-gray-700 mb-2 block">
              Contact Name *
            </Label>
            <Input
              id="contactName"
              name="contactName"
              type="text"
              required
              value={bookingData.contactName}
              onChange={handleInputChange}
              className="h-10"
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                value={bookingData.contactEmail}
                onChange={handleInputChange}
                className="pl-10 h-10"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700 mb-2 block">
              Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                required
                value={bookingData.contactPhone}
                onChange={handleInputChange}
                className="pl-10 h-10"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700 mb-2 block">
              Special Requests
            </Label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              value={bookingData.specialRequests}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base price</span>
                <span>₹{event.pricePerEvent.toLocaleString()}</span>
              </div>
              {parseInt(bookingData.guestCount) > event.capacity && (
                <div className="flex justify-between">
                  <span>Extra guests</span>
                  <span>₹{((parseInt(bookingData.guestCount) - event.capacity) * 500).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isBooking}
            className="w-full h-12 text-lg"
          >
            {isBooking ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Request Booking"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By requesting a booking, you agree to our terms and conditions. 
            This is a booking request and not a confirmed reservation.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default EventBookingSidebar;
