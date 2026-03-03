import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BookingSearchForm from "@/components/homePage/BookingSearchForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Hotel } from "lucide-react";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import LocationsSkeleton from "@/skeleton/LocationsSkeleton";
import { LocationCard } from "@/components/homePage/LocationCard";
import { getLocations, type LocationData } from "@/api/hotelsApi";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
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

  // Fetch locations using react-query
  const { data: locations = [], isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

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
              {error instanceof Error ? error.message : "Unable to load locations"}
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
                <LocationCard
                  key={index}
                  city={city}
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
                />
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