import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingSearchForm from "@/components/homePage/BookingSearchForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Hotel, Star } from "lucide-react";
import hotelData from "@/data.json";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
}

interface CityData {
  name: string;
  image: string;
  hotelCount: number;
  avgRating: number;
  avgPrice: number;
}

function HotelsPages() {
  const navigate = useNavigate();
  
  // Search data state
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: "2",
    children: "0",
  });

  // Handle search form submission - redirect to search results
  const handleSearch = (newSearchData: SearchData) => {
    const destination = encodeURIComponent(newSearchData.destination || "Goa, India");
    const checkIn = encodeURIComponent(newSearchData.checkIn || "15 Mar");
    const checkOut = encodeURIComponent(newSearchData.checkOut || "18 Mar");
    const adults = encodeURIComponent(newSearchData.adults);
    const children = encodeURIComponent(newSearchData.children);
    navigate(`/search/${destination}/${checkIn}/${checkOut}/${adults}/${children}`);
  };

  // Process hotel data to get city statistics
  const getCityData = (): CityData[] => {
    const cityMap = new Map<string, CityData>();
    
    (hotelData as any[]).forEach(hotel => {
      const city = hotel.destination;
      if (!cityMap.has(city)) {
        cityMap.set(city, {
          name: city,
          image: hotel.images?.[0] || "/placeholder.svg",
          hotelCount: 0,
          avgRating: 0,
          avgPrice: 0,
        });
      }
      
      const cityData = cityMap.get(city)!;
      cityData.hotelCount++;
      cityData.avgRating += hotel.rating || 0;
      cityData.avgPrice += hotel.pricePerNight || hotel.price || 0;
    });
    
    // Calculate averages and return array
    return Array.from(cityMap.values()).map(city => ({
      ...city,
      avgRating: Math.round((city.avgRating / city.hotelCount) * 10) / 10,
      avgPrice: Math.round(city.avgPrice / city.hotelCount),
    })).sort((a, b) => b.hotelCount - a.hotelCount); // Sort by hotel count
  };

  const cities = getCityData();

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

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.slice(0, 8).map((city, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setSearchData({...searchData, destination: city.name});
                  // Auto-fill search and redirect
                  const destination = encodeURIComponent(city.name);
                  const checkIn = encodeURIComponent(searchData.checkIn || "15 Mar");
                  const checkOut = encodeURIComponent(searchData.checkOut || "18 Mar");
                  const adults = encodeURIComponent(searchData.adults);
                  const children = encodeURIComponent(searchData.children);
                  navigate(`/search/${destination}/${checkIn}/${checkOut}/${adults}/${children}`);
                }}
              >
                <div className="relative h-48">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{city.avgRating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <h3 className="font-semibold text-lg text-gray-900">{city.name}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Hotel className="w-4 h-4 mr-1" />
                      <span>{city.hotelCount} hotels</span>
                    </div>
                    <span className="font-medium">₹{city.avgPrice.toLocaleString()}/night</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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