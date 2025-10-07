import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import hotelsData from "@/data.json"; // Your local hotel data file
import type { Hotel } from "@/types/hotelType";
import ImageGallery from "@/components/hotelDetails/ImageGallery";
import HotelInfo from "@/components/hotelDetails/HotelInfo";
import PropertyOverview from "@/components/hotelDetails/PropertyOverview";
import Amenities from "@/components/hotelDetails/Amenities";
import RoomList from "@/components/hotelDetails/RoomList";
import BookingSidebar from "@/components/hotelDetails/BookingSidebar";

function HotelDetails() {
  const { id, checkIn, checkOut, adults, children } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery hotel={hotel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HotelInfo hotel={hotel} />
          <PropertyOverview hotel={hotel} />
          <Amenities hotel={hotel} />
          <RoomList 
            hotel={hotel} 
            selectedRoom={selectedRoom} 
            onRoomSelect={setSelectedRoom} 
          />
        </div>
        <BookingSidebar 
          hotel={hotel}
          selectedRoom={selectedRoom}
          checkIn={checkIn || ""}
          checkOut={checkOut || ""}
          adults={adults || ""}
          children={children || ""}
        />
      </div>
    </div>
  );
}

export default HotelDetails;
