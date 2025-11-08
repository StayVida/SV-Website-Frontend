import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Hotel } from "@/types/hotelType";
import ImageGallery from "@/components/hotelDetails/ImageGallery";
import HotelInfo from "@/components/hotelDetails/HotelInfo";
import PropertyOverview from "@/components/hotelDetails/PropertyOverview";
import Amenities from "@/components/hotelDetails/Amenities";
import RoomList from "@/components/hotelDetails/RoomList";
import BookingSidebar from "@/components/hotelDetails/BookingSidebar";
import HotelDetailsSkeleton from "@/skeleton/HotelDetailsSkeleton";
import apiClient from "@/api/axios";

interface ApiHotelResponse {
  data: {
    hotelId: number;
    name: string;
    description: string;
    rating: number;
    destination: string;
    onArrivalPayment: boolean;
    images: string[];
    tags: string[];
    rooms: Array<{
      roomId: string;
      hotelId: number;
      type: string;
      price: number;
      adultsMax: number;
      childrenMax: number;
      bedCount: number;
      features: string[];
      roomImages: string[];
    }>;
    forEvent: boolean;
  };
  message: string;
  status: number;
}

function HotelDetails() {
  const { id, checkIn, checkOut, adults, children } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (checkIn) params.append("checkIn", checkIn);
        if (checkOut) params.append("checkOut", checkOut);

        const queryString = params.toString();
        const url = `/api/hotels/${id}/rooms${queryString ? `?${queryString}` : ""}`;

        const response = await apiClient.get<ApiHotelResponse>(url);
        const apiData = response.data?.data;

        if (!apiData) {
          throw new Error("Hotel data not found");
        }

        // Extract unique features from all rooms to create amenities
        const allFeatures = new Set<string>();
        apiData.rooms.forEach((room) => {
          room.features.forEach((feature) => allFeatures.add(feature));
        });

        // Map API response to Hotel type
        const mappedHotel: Hotel = {
          id: apiData.hotelId,
          name: apiData.name,
          type: "Hotel", // Default type since API doesn't provide it
          destination: apiData.destination,
          rating: apiData.rating,
          pricePerNight: apiData.rooms.length > 0 
            ? Math.min(...apiData.rooms.map((r) => r.price)) 
            : 0, // Use minimum room price
          tags: apiData.tags || [],
          amenities: Array.from(allFeatures).map((feature) => ({
            name: feature,
            icon: "", // API doesn't provide icons
          })),
          images: apiData.images || [],
          description: apiData.description || "",
          rooms: apiData.rooms.map((room) => ({
            id: room.roomId,
            name: room.type,
            images: room.roomImages || [],
            features: room.features || [],
            price: room.price,
            available: 10, // Default availability since API doesn't provide it
          })),
        };

        setHotel(mappedHotel);
        // Select first room by default
        if (mappedHotel.rooms.length > 0) {
          setSelectedRoom(mappedHotel.rooms[0].id);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load hotel details");
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, checkIn, checkOut]);

  if (loading) {
    return <HotelDetailsSkeleton />;
  }

  if (error || !hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600 py-10">
          <p className="text-xl font-semibold mb-2">Failed to load hotel details</p>
          <p className="text-gray-600">{error || "Hotel not found"}</p>
        </div>
      </div>
    );
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
