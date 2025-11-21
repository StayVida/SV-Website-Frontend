import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingSearchForm from "@/components/homePage/BookingSearchForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Hotel } from "lucide-react";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import LocationsSkeleton from "@/skeleton/LocationsSkeleton";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
}

interface LocationData {
  location: string;
  lowestPrice: number;
  hotelCount: number;
  images: string[];
}

const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    checkIn: formatDate(today),
    checkOut: formatDate(tomorrow),
  };
};

function HotelsPages() {
  const navigate = useNavigate();
  
  // Search data state
  const defaultDates = getDefaultDates();
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    adults: "2",
    children: "0",
  });

  // Handle search form submission - redirect to search results
  const handleSearch = (newSearchData: SearchData) => {
    const destination = encodeURIComponent(newSearchData.destination || "Goa, India");
    const fallbackDates = getDefaultDates();
    const checkIn = encodeURIComponent(newSearchData.checkIn || fallbackDates.checkIn);
    const checkOut = encodeURIComponent(newSearchData.checkOut || fallbackDates.checkOut);
    const adults = encodeURIComponent(newSearchData.adults);
    const children = encodeURIComponent(newSearchData.children);
    navigate(`/search/${destination}/${checkIn}/${checkOut}/${adults}/${children}`);
  };

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URI}${API_ENDPOINTS.LOCATIONS_LIST}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_X_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const result = await response.json();
        const locationsData = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

        setLocations(locationsData);
      } catch (err: any) {
        setError(err.message || "Unable to load locations");
        console.error("Error fetching locations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const cities = locations;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing hotels and accommodations
            </p>
          </div>
          <BookingSearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600">
              Explore hotels in these amazing destinations
            </p>
          </div>

          {isLoading && <LocationsSkeleton />}

          {error && (
            <div className="text-center py-4 text-red-600">
              {error}
            </div>
          )}

          {!isLoading && !error && cities.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No destinations available right now. Please check back later.
            </div>
          )}

          {!isLoading && !error && cities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.slice(0, 8).map((city, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    setSearchData({ ...searchData, destination: city.location });
                    // Auto-fill search and redirect
                    const destination = encodeURIComponent(city.location);
                    const fallbackDates = getDefaultDates();
                    const checkIn = encodeURIComponent(searchData.checkIn || fallbackDates.checkIn);
                    const checkOut = encodeURIComponent(searchData.checkOut || fallbackDates.checkOut);
                    const adults = encodeURIComponent(searchData.adults);
                    const children = encodeURIComponent(searchData.children);
                    navigate(`/search/${destination}/${checkIn}/${checkOut}/${adults}/${children}`);
                  }}
                >
                  <div className="relative h-48">
                    <img
                      src={city.images?.[0] || "/placeholder.svg"}
                      alt={city.location}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                        {city.hotelCount} hotels
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <h3 className="font-semibold text-lg text-gray-900">{city.location}</h3>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Hotel className="w-4 h-4 mr-1" />
                        <span>{city.hotelCount} hotels</span>
                      </div>
                      <span className="font-medium">₹{city.lowestPrice.toLocaleString()}/night</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View All Destinations Button */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="px-8 py-3"
              onClick={() => {
                // Show all cities or navigate to a full list page
                console.log("View all destinations clicked");
              }}
            >
              View All Destinations
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HotelsPages;