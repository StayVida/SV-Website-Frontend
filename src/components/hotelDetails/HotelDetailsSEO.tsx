"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Hotel } from "@/types/hotelType";
import ImageGallery from "@/components/hotelDetails/ImageGallery";
import HotelInfo from "@/components/hotelDetails/HotelInfo";
import PropertyOverview from "@/components/hotelDetails/PropertyOverview";
import Amenities from "@/components/hotelDetails/Amenities";
import RoomList from "@/components/hotelDetails/RoomList";
import BookingSidebar from "@/components/hotelDetails/BookingSidebar";
import HotelReviews from "@/components/hotelDetails/HotelReviews";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import apiClient from "@/api/axios";
import { normalizeImages, ensureBase64Prefix } from "@/utils/imageUtils";
import usePageSEO from "@/hooks/usePageSEO";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiRoomInstance {
  roomId: string;
  room_NO: number;
}

interface ApiRoomType {
  type: string;
  rooms?: ApiRoomInstance[];
  price: number;
  platformCharges: number;
  taxRate: number;
  advanceRate: number;
  totalAmount: number;
  advanceAmount: number;
  adultsMax: number;
  childrenMax: number;
  bedCount: number;
  features: string[];
  roomImages: string[];
}

interface ApiHotelData {
  hotelId: string;
  name: string;
  description: string;
  amenities: string[];
  rating: number;
  destination: string;
  onArrivalPayment: boolean;
  images: string[];
  tags: string[];
  countryCode: string | null;
  phoneNo: string;
  rooms: ApiRoomType[];
  forEvent?: boolean;
}

interface ApiResponse {
  data: ApiHotelData;
  message: string;
  status: number;
}

interface HotelDetailsSEOProps {
  initialData?: any;
}

function HotelDetails({ initialData }: HotelDetailsSEOProps = {}) {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract id from slug or fallback to direct id param
  let id = "";
  if (params?.slug && Array.isArray(params?.slug)) {
    const lastSegment = params.slug[params.slug.length - 1];
    if (lastSegment.includes('_')) {
      id = lastSegment.split('_')[0];
    } else {
      const parts = lastSegment.split('-');
      if (parts[0] === 'H' && parts.length > 1) {
        id = `${parts[0]}-${parts[1]}`;
      } else {
        id = parts[0];
      }
    }
  } else if (params?.id) {
    id = params.id as string;
  }
  
  const checkIn = searchParams?.get("checkIn") || "";
  const checkOut = searchParams?.get("checkOut") || "";
  const adults = searchParams?.get("adults") || "2";
  const children = searchParams?.get("children") || "0";
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Convert date from "01 Nov" format to "YYYY-MM-DD" format
  const parseDate = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === "") {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    // If it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    try {
      // Create a date for the current year
      const currentYear = new Date().getFullYear();
      const date = new Date(`${dateStr} ${currentYear}`);
      
      // If the parsed date is before today, it might be for next year
      if (date < new Date(new Date().setHours(0,0,0,0))) {
        date.setFullYear(currentYear + 1);
      }

      // Format as YYYY-MM-DD
      const result = date.toISOString().split('T')[0];
      
      // Make sure it's valid
      if (result === 'NaN-NaN-NaN' || !result) {
        throw new Error("Invalid date result");
      }

      return result;
    } catch (error) {
      console.error("Date parsing error:", error, "for date:", dateStr);
      // Fallback to today's date
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  };

  // Pre-process dates and map initialData
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0],
    };
  };

  let checkInDate = "";
  let checkOutDate = "";

  if (!checkIn || !checkOut) {
    const defaults = getDefaultDates();
    checkInDate = defaults.checkIn;
    checkOutDate = defaults.checkOut;
  } else {
    checkInDate = parseDate(checkIn);
    checkOutDate = parseDate(checkOut);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(checkInDate) || !dateRegex.test(checkOutDate)) {
    const defaults = getDefaultDates();
    checkInDate = defaults.checkIn;
    checkOutDate = defaults.checkOut;
  }

  const parseISODate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  const startDate = parseISODate(checkInDate);
  const endDate = parseISODate(checkOutDate);
  const timeDiff = Math.max(0, endDate.getTime() - startDate.getTime());
  const stayDuration = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  const mapApiDataToHotel = (apiData: any): Hotel => {
    const flatRooms = (apiData.rooms || []).flatMap((roomType: any, index: number) => {
      if (roomType.rooms && roomType.rooms.length > 0) {
        return roomType.rooms.map((instance: any) => ({
          id: instance.roomId,
          name: roomType.type,
          images: normalizeImages(roomType.roomImages),
          features: roomType.features || [],
          price: roomType.price,
          platformCharges: roomType.platformCharges,
          taxRate: roomType.taxRate,
          stayDuration: stayDuration,
          totalAmount: roomType.totalAmount,
          adultsMax: roomType.adultsMax,
          childrenMax: roomType.childrenMax,
          advanceAmount: roomType.advanceAmount,
          available: 1,
        }));
      } else {
        return [{
          id: `${apiData.hotelId}_type_${index}`,
          name: roomType.type,
          images: normalizeImages(roomType.roomImages),
          features: roomType.features || [],
          price: roomType.price,
          platformCharges: roomType.platformCharges,
          taxRate: roomType.taxRate,
          stayDuration: stayDuration,
          totalAmount: roomType.totalAmount,
          adultsMax: roomType.adultsMax,
          childrenMax: roomType.childrenMax,
          advanceAmount: roomType.advanceAmount,
          available: 1,
        }];
      }
    });

    return {
      id: apiData.hotelId,
      name: apiData.name,
      type: apiData.forEvent ? "Resort" : "Hotel",
      destination: apiData.destination,
      rating: apiData.rating,
      pricePerNight: flatRooms.length > 0 ? flatRooms[0].price : 0,
      tags: apiData.tags || [],
      amenities: (apiData.amenities || []).map((amenity: string) => ({
        name: amenity,
        icon: "",
      })),
      images: normalizeImages(apiData.images),
      description: apiData.description || "",
      rooms: flatRooms,
      onArrivalPayment: apiData.onArrivalPayment
    };
  };

  const initialMappedHotel = initialData && initialData.data ? mapApiDataToHotel(initialData.data) : undefined;

  const {
    data: hotel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotelDetails", id, checkIn, checkOut],
    initialData: initialMappedHotel,
    queryFn: async (): Promise<Hotel> => {
      if (!id) {
        throw new Error("Hotel ID is required");
      }

      const paramsSearch = new URLSearchParams({
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
      const url = `${API_ENDPOINTS.HOTEL_DETAILS}/${id}/rooms?${paramsSearch.toString()}`;

      try {
        const response = await apiClient.get<ApiResponse>(url);
        const result = response.data;
        
        if (result.status === 200 && result.data) {
          return mapApiDataToHotel(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch hotel details");
        }
      } catch (err: any) {
        throw new Error(err.response?.data?.message || err.message || "Failed to fetch hotel details");
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (hotel && hotel.rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(hotel.rooms[0].id);
    }
  }, [hotel, selectedRoom]);

  usePageSEO({
    title: hotel ? hotel.name : "Hotel Details",
    description: hotel
      ? `Book ${hotel.name} in ${hotel.destination} on StayVida. ${hotel.description?.slice(0, 100) ?? ""}`
      : "View hotel details and book your perfect stay on StayVida.",
    keywords: hotel ? `${hotel.name}, hotel ${hotel.destination}, book hotel StayVida` : "hotel details",
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="w-full h-[600px] rounded-2xl mb-8" />
        <Skeleton className="w-48 h-8 rounded-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="w-full h-[250px] rounded-xl" />
            <Skeleton className="w-full h-[200px] rounded-xl" />
            <Skeleton className="w-full h-[300px] rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="w-full h-[500px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error instanceof Error ? error.message : "Error fetching hotel details"}</p>
          <p className="text-gray-500 text-sm">Hotel ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Hotel not found</p>
        </div>
      </div>
    );
  }

  // Calculate nights for display
  const displayNights = hotel.rooms.length > 0 ? hotel.rooms[0].stayDuration : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery hotel={hotel} />

      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Stay: {displayNights} {displayNights === 1 ? 'Night' : 'Nights'}
        </span>
        <span className="text-gray-500 text-sm">
          ({checkIn} - {checkOut})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HotelInfo hotel={hotel} />
          <PropertyOverview hotel={hotel} />
          <Amenities hotel={hotel} />
          <HotelReviews hotelId={hotel.id} />
          <RoomList
            hotel={hotel}
            selectedRoom={selectedRoom}
            onRoomSelect={setSelectedRoom}
          />
          
          {/* SEO Enhancements: Nearby Attractions & FAQs */}
          <div className="mb-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Attractions in {hotel.destination || 'the area'}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-700 font-medium">Local Market</span>
                  <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">~ 2.5 km</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-700 font-medium">City Center</span>
                  <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">~ 5.0 km</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Popular Tourist Spots</span>
                  <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">Variable</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-500 italic">Distances are approximate. Please contact the property for exact directions.</p>
            </div>
          </div>

          <div className="mb-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">What are the check-in and check-out times at {hotel.name}?</h3>
                <p className="text-gray-700 text-sm leading-relaxed">Check-in is typically from 2:00 PM, and check-out is until 11:00 AM. Please contact the property directly for early check-in or late check-out requests.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">Is {hotel.name} suitable for families?</h3>
                <p className="text-gray-700 text-sm leading-relaxed">Yes, {hotel.name} is a great choice for families visiting {hotel.destination || 'the area'}, offering comfortable accommodations and various amenities suitable for group stays.</p>
              </div>
            </div>
          </div>
          
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
