import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventBookingForm from "@/components/homePage/EventBookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import LocationsSkeleton from "@/skeleton/LocationsSkeleton";

interface SearchData {
  eventType: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  persons: string;
}

interface ApiEventData {
  eventType: string;
  lowestPrice: number;
  images: string[];
}

interface ApiEventLocation {
  location: string;
  events: ApiEventData[];
}

interface EventCardData {
  location: string;
  eventType: string;
  image: string;
  lowestPrice: number;
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

const WEDDING_EVENT_TYPE = "Wedding";

const createEventCards = (
  locations: ApiEventLocation[],
  filterFn: (event: ApiEventData) => boolean
): EventCardData[] => {
  return locations
    .flatMap((location) =>
      (location.events || [])
        .filter(filterFn)
        .map((event) => ({
          location: location.location,
          eventType: event.eventType,
          image: event.images?.[0] || "/placeholder.svg",
          lowestPrice: Math.round(event.lowestPrice || 0),
        }))
    )
    .sort((a, b) => a.location.localeCompare(b.location));
};

function EventsPages() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  // Search data state
  const defaultDates = getDefaultDates();
  const [searchData, setSearchData] = useState<SearchData>({
    eventType: "",
    destination: "",
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    persons: "2",
  });

  const [eventLocations, setEventLocations] = useState<ApiEventLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle search form submission - redirect to search results
  const handleSearch = (newSearchData: SearchData) => {
    const fallback = getDefaultDates();
    const queryParams = new URLSearchParams({
      destination: newSearchData.destination,
      checkIn: newSearchData.checkIn || fallback.checkIn,
      checkOut: newSearchData.checkOut || fallback.checkOut,
      persons: newSearchData.persons || "2",
      eventType: newSearchData.eventType,
    });
    
    navigate(`/events/search?${queryParams.toString()}`);
  };

  useEffect(() => {
    const fetchEventLocations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URI}${API_ENDPOINTS.EVENTS_LIST}`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event destinations");
        }

        const result = await response.json();
        const locationsData: ApiEventLocation[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

        setEventLocations(locationsData);
      } catch (err: any) {
        console.error("Error fetching event destinations:", err);
        setError(err.message || "Unable to load event destinations");
        setEventLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventLocations();
  }, []);

  const weddingEvents: EventCardData[] = createEventCards(
    eventLocations,
    (event) => event.eventType?.toLowerCase() === WEDDING_EVENT_TYPE.toLowerCase()
  );

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
              Popular Wedding Destinations
            </h2>
            <p className="text-gray-600">
              Discover dreamy venues perfect for weddings
            </p>
          </div>

          {isLoading && <LocationsSkeleton />}

          {error && (
            <div className="text-center py-4 text-red-600">
              {error}
            </div>
          )}

          {!isLoading && !error && weddingEvents.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No wedding destinations available right now. Please check back later.
            </div>
          )}

          {!isLoading && !error && weddingEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {weddingEvents.slice(0, 8).map((eventCard, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    setSearchData({
                      ...searchData,
                      destination: eventCard.location,
                      eventType: eventCard.eventType,
                    });
                    // Auto-fill search and redirect
                    const fallback = getDefaultDates();
                    const queryParams = new URLSearchParams({
                      destination: eventCard.location,
                      checkIn: searchData.checkIn || fallback.checkIn,
                      checkOut: searchData.checkOut || fallback.checkOut,
                      persons: searchData.persons || "2",
                      eventType: eventCard.eventType || WEDDING_EVENT_TYPE,
                    });
                    navigate(`/events/search?${queryParams.toString()}`);
                  }}
                >
                  <div className="relative h-48">
                    <img
                      src={eventCard.image}
                      alt={eventCard.location}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                        {eventCard.eventType}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <h3 className="font-semibold text-lg text-gray-900">{eventCard.location}</h3>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="text-gray-700 font-medium">{eventCard.eventType}</span>
                      <span className="font-medium">₹{eventCard.lowestPrice.toLocaleString()}/event</span>
                    </div>
                    <div className="text-sm text-gray-500">Multiple venues available</div>
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
