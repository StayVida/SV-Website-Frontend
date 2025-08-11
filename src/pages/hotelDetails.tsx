import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Calendar, Users, X, Check } from "lucide-react";
import hotelsData from "@/data.json"; // Your local hotel data file
import type { Hotel } from "@/types/hotelType";

function HotelDetails() {
  const { id, checkIn, checkOut, adults, children } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [checkInDate, setCheckInDate] = useState<string>(checkIn || "");
  const [checkOutDate, setCheckOutDate] = useState<string>(checkOut || "");

  useEffect(() => {
    // Simulate fetching hotel data from JSON or API
    const foundHotel = (hotelsData as Hotel[]).find((h) => h.id.toString() === id);
    if (foundHotel) {
      setHotel(foundHotel);
      // Select first available room by default
      const firstAvailable = foundHotel.rooms.find((r) => r.available > 0) || foundHotel.rooms[0];
      setSelectedRoom(firstAvailable ? firstAvailable.id : null);
      setNotFound(false);
    } else {
      setHotel(null);
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    // Prepare a sample object for user to add to data.json
    const newHotel: Hotel = {
      id: Number(id),
      name: "New Hotel Name",
      type: "Hotel",
      destination: "City, Country",
      rating: 4.0,
      pricePerNight: 1000,
      tags: ["Sample Tag"],
      amenities: [
        { name: "WiFi", icon: "wifi" },
        { name: "Breakfast", icon: "breakfast" }
      ],
      images: ["/images/sample-1.jpg", "/images/sample-2.jpg"],
      description: "Description for the new hotel.",
      rooms: [
        {
          id: "r-new-1",
          name: "Standard Room",
          images: ["/images/sample-1.jpg"],
          features: ["Feature 1", "Feature 2"],
          price: 1000,
          available: 10
        },
        {
          id: "r-new-2",
          name: "Deluxe Room",
          images: ["/images/sample-2.jpg"],
          features: ["Feature 3", "Feature 4"],
          price: 1500,
          available: 5
        }
      ]
    };
    return (
      <div className="p-8 text-center text-gray-500">
        <div>Hotel not found for id: {id}</div>
        <div className="mt-4 text-left max-w-xl mx-auto">
          <div className="font-bold mb-2">To add this hotel, copy the following object into data.json:</div>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(newHotel, null, 2)}</pre>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="p-8 text-center text-gray-500">Loading hotel details...</div>;
  }

  const selectedRoomData = hotel.rooms.find((r) => r.id === selectedRoom);
  const basePrice: number = selectedRoomData?.price ?? hotel.pricePerNight;
  const taxes: number = Math.round(basePrice * 0.12);
  const platformCharges: number = 199;
  const totalPrice: number = basePrice + taxes + platformCharges;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Gallery (full width) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="col-span-1">
          <div className="relative h-80 rounded-lg overflow-hidden">
            <img
              src={hotel.images[0] || "/placeholder.svg"}
              alt="Main hotel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-2">
          {hotel.images.slice(1).map((image, index) => (
            <div
              key={index}
              className="relative h-[156px] rounded-lg overflow-hidden"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Hotel image ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Details and Booking layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Hotel Info */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(hotel.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-medium">{hotel.rating}</span>
                    <span className="ml-1 text-gray-600">
                      ({hotel.rating} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{hotel.destination}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotel.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Property Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity.name}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  {amenity.icon && (
                    <span className="w-6 h-6 text-green-600 mx-auto mb-2 text-2xl block" role="img" aria-label={amenity.name}>
                      {amenity.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Rooms */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Rooms
            </h2>
            <div className="space-y-4">
              {hotel.rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative w-48 h-32">
                        <img
                          src={room.images[0] || "/placeholder.svg"}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{room.name}</h3>
                          {selectedRoom === room.id && (
                            <Badge className="bg-gray-900 text-white">
                              Selected
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {room.features.map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              ₹{room.price.toLocaleString()}
                            </span>
                            <span className="text-gray-600">/night</span>
                          </div>
                          {selectedRoom === room.id ? (
                            <Button disabled className="bg-gray-900 text-white">
                              Selected
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setSelectedRoom(room.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Select Room
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex space-x-2">
                        {room.images.slice(1).map((image, index) => (
                          <div
                            key={index}
                            className="relative w-16 h-12 rounded overflow-hidden"
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${room.name} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
         {/* Booking Sidebar */}
        <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Book Your Stay</h3>

                <div className="space-y-4 mb-6">
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
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
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
      </div>
    </div>
  );
}

export default HotelDetails;
