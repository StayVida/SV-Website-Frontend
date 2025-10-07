import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventBookingForm from "@/components/homePage/EventBookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star } from "lucide-react";
import eventData from "@/data.json";

interface SearchData {
  eventType: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  persons: string;
}

interface CityData {
  name: string;
  image: string;
  eventCount: number;
  avgRating: number;
  avgPrice: number;
  eventTypes: string[];
}

function EventsPages() {
  const navigate = useNavigate();
  
  // Search data state
  const [searchData, setSearchData] = useState<SearchData>({
    eventType: "",
    destination: "",
    checkIn: "",
    checkOut: "",
    persons: "",
  });

  // Handle search form submission - redirect to search results
  const handleSearch = (newSearchData: SearchData) => {
    const queryParams = new URLSearchParams({
      destination: newSearchData.destination,
      checkIn: newSearchData.checkIn,
      checkOut: newSearchData.checkOut,
      persons: newSearchData.persons,
      eventType: newSearchData.eventType,
    });
    
    navigate(`/events/search?${queryParams.toString()}`);
  };

  // Process event data to get city statistics
  const getCityData = (): CityData[] => {
    const cityMap = new Map<string, CityData>();
    
    // Filter only event data (events have id starting with "event-")
    const allEvents = (eventData as any[]).filter(item => item.id && item.id.toString().startsWith("event-"));
    
    allEvents.forEach(event => {
      const city = event.destination;
      if (!cityMap.has(city)) {
        cityMap.set(city, {
          name: city,
          image: event.images?.[0] || "/placeholder.svg",
          eventCount: 0,
          avgRating: 0,
          avgPrice: 0,
          eventTypes: [],
        });
      }
      
      const cityData = cityMap.get(city)!;
      cityData.eventCount++;
      cityData.avgRating += event.rating || 0;
      cityData.avgPrice += event.pricePerEvent || 0;
      
      // Add unique event types
      if (event.type && !cityData.eventTypes.includes(event.type)) {
        cityData.eventTypes.push(event.type);
      }
    });
    
    // Calculate averages and return array
    return Array.from(cityMap.values()).map(city => ({
      ...city,
      avgRating: Math.round((city.avgRating / city.eventCount) * 10) / 10,
      avgPrice: Math.round(city.avgPrice / city.eventCount),
    })).sort((a, b) => b.eventCount - a.eventCount); // Sort by event count
  };

  const cities = getCityData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Plan Your Perfect Event
            </h1>
            <p className="text-lg text-gray-600">
              Discover amazing venues for your special occasions
            </p>
          </div>
          <EventBookingForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Popular Event Destinations
            </h2>
            <p className="text-gray-600">
              Explore event venues in these amazing destinations
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
                  const queryParams = new URLSearchParams({
                    destination: city.name,
                    checkIn: searchData.checkIn || "",
                    checkOut: searchData.checkOut || "",
                    persons: searchData.persons || "",
                    eventType: searchData.eventType || "",
                  });
                  navigate(`/events/search?${queryParams.toString()}`);
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
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{city.eventCount} venues</span>
                    </div>
                    <span className="font-medium">₹{city.avgPrice.toLocaleString()}/event</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {city.eventTypes.slice(0, 2).map((type, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                    {city.eventTypes.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{city.eventTypes.length - 2} more
                      </span>
                    )}
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
                console.log("View all event destinations clicked");
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

export default EventsPages;
