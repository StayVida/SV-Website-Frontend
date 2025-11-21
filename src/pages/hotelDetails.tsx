import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Hotel } from "@/types/hotelType";
import ImageGallery from "@/components/hotelDetails/ImageGallery";
import HotelInfo from "@/components/hotelDetails/HotelInfo";
import PropertyOverview from "@/components/hotelDetails/PropertyOverview";
import Amenities from "@/components/hotelDetails/Amenities";
import RoomList from "@/components/hotelDetails/RoomList";
import BookingSidebar from "@/components/hotelDetails/BookingSidebar";
import HotelReviews from "@/components/hotelDetails/HotelReviews";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";

interface ApiRoom {
  roomId: string;
  hotelId: number;
  type: string;
  price: number;
  adultsMax: number;
  childrenMax: number;
  bedCount: number;
  features: string[];
  roomImages: string[];
}

interface ApiHotelData {
  hotelId: number;
  name: string;
  description: string;
  rating: number;
  destination: string;
  onArrivalPayment: boolean;
  images: string[];
  tags: string[];
  amenities?: string[];
  rooms: ApiRoom[];
  forEvent: boolean;
}

interface ApiResponse {
  data: ApiHotelData;
  message: string;
  status: number;
}

function HotelDetails() {
  const { id, checkIn, checkOut, adults, children } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Convert date from "01 Nov" format to "YYYY-MM-DD" format
  const parseDate = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === "") {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }

    // Check if date is already in YYYY-MM-DD format
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(dateStr)) {
      return dateStr;
    }
    
    try {
      // Parse date in format "01 Nov" or "01 November" or "15 Mar"
      const parts = dateStr.trim().split(' ');
      if (parts.length < 2) {
        throw new Error("Invalid date format");
      }

      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].toLowerCase();
      
      // Month name to number mapping
      const monthMap: { [key: string]: number } = {
        'jan': 0, 'january': 0,
        'feb': 1, 'february': 1,
        'mar': 2, 'march': 2,
        'apr': 3, 'april': 3,
        'may': 4,
        'jun': 5, 'june': 5,
        'jul': 6, 'july': 6,
        'aug': 7, 'august': 7,
        'sep': 8, 'september': 8,
        'oct': 9, 'october': 9,
        'nov': 10, 'november': 10,
        'dec': 11, 'december': 11,
      };

      const month = monthMap[monthStr];
      if (month === undefined || isNaN(day) || day < 1 || day > 31) {
        throw new Error("Invalid date format");
      }

      const currentYear = new Date().getFullYear();
      const date = new Date(currentYear, month, day);
      
      // Validate the date
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      // If date is in the past, use next year
      if (date < new Date()) {
        date.setFullYear(currentYear + 1);
      }
      
      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const dayNum = String(date.getDate()).padStart(2, '0');
      
      const result = `${year}-${monthNum}-${dayNum}`;
      
      // Final validation - ensure result is valid
      if (result.includes('NaN') || !isoDateRegex.test(result)) {
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

  // Extract numeric ID from string (handles cases like "event-2" or "8")
  const extractNumericId = (idStr: string | undefined): number | null => {
    if (!idStr) return null;
    
    // If it's already a number, return it
    const numericId = parseInt(idStr, 10);
    if (!isNaN(numericId) && numericId > 0) {
      return numericId;
    }
    
    // If it's a string like "event-2", try to extract the number
    const match = idStr.match(/\d+/);
    if (match) {
      const extracted = parseInt(match[0], 10);
      if (!isNaN(extracted) && extracted > 0) {
        return extracted;
      }
    }
    
    return null;
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!id) {
        setError("Hotel ID is required");
        setIsLoading(false);
        return;
      }

      // Extract numeric ID
      const numericId = extractNumericId(id);
      if (!numericId) {
        setError(`Invalid hotel ID format: "${id}". Hotel ID must be a number.`);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get default dates if not provided
        const getDefaultDates = () => {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return {
            checkIn: today.toISOString().split('T')[0],
            checkOut: tomorrow.toISOString().split('T')[0],
          };
        };

        let checkInDate: string;
        let checkOutDate: string;

        if (!checkIn || !checkOut) {
          const defaults = getDefaultDates();
          checkInDate = defaults.checkIn;
          checkOutDate = defaults.checkOut;
        } else {
          // Parse the dates from URL params
          checkInDate = parseDate(checkIn);
          checkOutDate = parseDate(checkOut);
        }

        // Validate dates before making the API call
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(checkInDate) || !dateRegex.test(checkOutDate)) {
          console.error("Invalid date format:", { checkInDate, checkOutDate });
          const defaults = getDefaultDates();
          checkInDate = defaults.checkIn;
          checkOutDate = defaults.checkOut;
        }

        // Build URL with proper encoding using numeric ID
        const params = new URLSearchParams({
          checkIn: checkInDate,
          checkOut: checkOutDate,
        });
        const url = `${API_BASE_URI}${API_ENDPOINTS.HOTEL_DETAILS}/${numericId}/rooms?${params.toString()}`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
        });

        let result: ApiResponse;
        
        // Try to parse response as JSON
        try {
          const responseText = await response.text();
          result = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error("Failed to parse API response");
        }

        if (!response.ok) {
          const errorMessage = result.message || "Failed to fetch hotel details";
          throw new Error(errorMessage);
        }

        if (result.status === 200 && result.data) {
          const apiData = result.data;

          console.log("apiData from hotelDetails.tsx", apiData);
          // Map API response to Hotel type
          const mappedHotel: Hotel = {
            id: apiData.hotelId,
            name: apiData.name,
            type: apiData.forEvent ? "Resort" : "Hotel", // Default type based on forEvent
            destination: apiData.destination,
            rating: apiData.rating,
            pricePerNight: apiData.rooms.length > 0 ? apiData.rooms[0].price : 0, // Use first room price or 0
            tags: apiData.tags || [],
            amenities: (apiData.amenities || []).map((amenity) => ({
              name: amenity,
              icon: "",
            })),
            images: apiData.images || [],
            description: apiData.description || "",
            rooms: apiData.rooms.map((room) => ({
              id: room.roomId,
              name: room.type,
              images: room.roomImages || [],
              features: room.features || [],
              price: room.price,
              available: 1, // Default to 1 as API doesn't provide availability
            })),
          };

          setHotel(mappedHotel);
          
          // Select first room by default
          if (mappedHotel.rooms.length > 0) {
            setSelectedRoom(mappedHotel.rooms[0].id);
          }
        } else {
          throw new Error(result.message || "Failed to fetch hotel details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching hotel details");
        console.error("Error fetching hotel details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, checkIn, checkOut]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery hotel={hotel} />

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
