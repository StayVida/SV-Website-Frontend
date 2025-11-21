import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import SearchSummary from "@/components/searchResult/SearchSummary"
import FilterSidebar from "@/components/searchResult/FilterSidebar"
import Results from "@/components/searchResult/Results"
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api"
import ResultsSkeleton from "@/skeleton/ResultsSkeleton"

interface SearchData {
  destination: string
  checkIn: string
  checkOut: string
  adults: string
  children: string
}

interface ApiHotel {
  id: number;
  name: string;
  type: string;
  destination: string;
  rating: number;
  amenities?: string[]; // Optional as API may not always include it
  imageUrl: string | null;
  isForEvent: boolean;
  price: number;
}

interface ApiResponse {
  data: ApiHotel[];
  message: string;
  status: number;
}

function SearchResult() {
  const params = useParams()
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
  })

  const [hotels, setHotels] = useState<ApiHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state (example, can be expanded)
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [hotelTypes, setHotelTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

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

  useEffect(() => {
    // Get search parameters from route params
    const newSearchData = {
      destination: params.destination || "Goa, India",
      checkIn: params.checkIn || "15 Mar",
      checkOut: params.checkOut || "18 Mar",
      adults: params.adults || "2",
      children: params.children || "0",
    };
    setSearchData(newSearchData);
  }, [params])

  useEffect(() => {
    const fetchHotels = async () => {
      if (!searchData.destination) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Parse dates to YYYY-MM-DD format
        const checkInDate = parseDate(searchData.checkIn);
        const checkOutDate = parseDate(searchData.checkOut);

        // Extract location from destination (remove ", India" or similar)
        const location = searchData.destination.split(',')[0].trim();

        const requestBody = {
          adults: parseInt(searchData.adults) || 2,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          children: parseInt(searchData.children) || 0,
          location: location,
        };


        const response = await fetch(`${API_BASE_URI}${API_ENDPOINTS.SEARCH_HOTELS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
          body: JSON.stringify(requestBody),
        });

        // Try to parse response as JSON
        let result: ApiResponse;
        try {
          const responseText = await response.text();
          result = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error("Failed to parse API response");
        }

        if (!response.ok) {
          const errorMessage = result.message || "Failed to fetch hotels";
          throw new Error(errorMessage);
        }

        if (result.status === 200 && result.data) {
          setHotels(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch hotels");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching hotels");
        console.error("Error fetching hotels:", err);
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [searchData.destination, searchData.checkIn, searchData.checkOut, searchData.adults, searchData.children]);

  // Filter hotels based on sidebar filters
  const filteredHotels = hotels.filter(hotel => {
    // Price filter (one directional: 0 to maxPrice)
    const price = hotel.price || 0;
    if (price > maxPrice) return false;
    // Hotel type filter
    if (hotelTypes.length > 0 && !hotelTypes.includes(hotel.type)) return false;
    // Amenities filter - API returns amenities as string array (handle undefined)
    if (
      amenities.length > 0 &&
      hotel.amenities &&
      !amenities.every(a => hotel.amenities!.includes(a))
    ) return false;
    return true;
  });
  // Map API hotels to Results component format
  const mappedHotels = filteredHotels.map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    type: hotel.type,
    destination: hotel.destination,
    rating: hotel.rating,
    pricePerNight: hotel.price,
    amenities: (hotel.amenities || []).map(amenity => ({ name: amenity, icon: "" })), // Convert string array to amenity objects, handle undefined
    images: hotel.imageUrl ? [hotel.imageUrl] : [],
  }));

  if (isLoading) {
    return (
      <>
        <SearchSummary searchData={searchData} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
          <div className="flex flex-col lg:flex-row gap-8 h-screen min-h-0">
            <FilterSidebar
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              hotelTypes={hotelTypes}
              setHotelTypes={setHotelTypes}
              amenities={amenities}
              setAmenities={setAmenities}
            />
            <div className="flex-1 h-full overflow-y-auto">
              <ResultsSkeleton count={6} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SearchSummary searchData={searchData} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
          <div className="flex flex-col lg:flex-row gap-8 h-screen min-h-0">
            <FilterSidebar
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              hotelTypes={hotelTypes}
              setHotelTypes={setHotelTypes}
              amenities={amenities}
              setAmenities={setAmenities}
            />
            <div className="flex-1 h-full overflow-y-auto flex items-center justify-center">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SearchSummary searchData={searchData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 h-screen min-h-0">
          <FilterSidebar
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            hotelTypes={hotelTypes}
            setHotelTypes={setHotelTypes}
            amenities={amenities}
            setAmenities={setAmenities}
          />
          <Results hotels={mappedHotels} />
        </div>
      </div>
    </>
  )
}

export default SearchResult