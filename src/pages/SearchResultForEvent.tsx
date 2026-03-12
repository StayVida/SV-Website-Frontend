import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EventSearchSummary from "@/components/searchResult/EventSearchSummary";
import EventFilterSidebar from "@/components/searchResult/EventFilterSidebar";
import EventResults from "@/components/searchResult/EventResults";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";
import ResultsSkeleton from "@/skeleton/ResultsSkeleton";
import usePageSEO from "@/hooks/usePageSEO";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  eventType?: string;
}

interface ApiEventResponse {
  hotel: {
    image: string;
    hotelAmenities: string[];
    hotel_ID: number;
    name: string;
    destination: string;
    type: string;
  };
  event: {
    event_ID: string;
    guestCount: number;
    eventType: string;
    eventAmenities: string[];
  };
}

interface Event {
  id: string;
  name: string;
  type: string;
  destination: string;
  location?: string;
  rating: number;
  pricePerEvent: number;
  capacity: number;
  date: string;
  time: string;
  amenities: Array<{ name: string; icon: string }>;
  images: string[];
  description: string;
  tags: string[];
  hotelId: number;
}

function SearchResultForEvent() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
    eventType: "",
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventTypeDisplay = searchData.eventType || "Event";
  const destinationDisplay = searchData.destination || "India";

  usePageSEO({
    title: `${eventTypeDisplay} Venues in ${destinationDisplay}`,
    description: `Discover and book ${eventTypeDisplay.toLowerCase()}-friendly venues in ${destinationDisplay} with StayVida. Plan your perfect event today.`,
  });

  // Filter state
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
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
      const parts = dateStr.trim().split(' ');
      if (parts.length < 2) {
        throw new Error("Invalid date format");
      }

      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].toLowerCase();

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

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      if (date < new Date()) {
        date.setFullYear(currentYear + 1);
      }

      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, '0');
      const dayNum = String(date.getDate()).padStart(2, '0');

      return `${year}-${monthNum}-${dayNum}`;
    } catch (error) {
      console.error("Date parsing error:", error, "for date:", dateStr);
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  };

  useEffect(() => {
    // Get search parameters from URL search params or route params
    const destination = searchParams.get('destination') || params.destination || "";
    const checkIn = searchParams.get('checkIn') || params.checkIn || "";
    const checkOut = searchParams.get('checkOut') || params.checkOut || "";
    const adults = searchParams.get('persons') || params.adults || "2";
    const children = searchParams.get('children') || params.children || "0";
    const eventType = searchParams.get('eventType') || "";

    setSearchData({
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      eventType,
    });

    // Set initial event type filter if provided
    if (eventType) {
      setEventTypes([eventType]);
    }
  }, [params, searchParams]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!searchData.destination || !searchData.checkIn || !searchData.checkOut || !searchData.eventType) {
        setEvents([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const eventStartDate = parseDate(searchData.checkIn);
        const eventEndDate = parseDate(searchData.checkOut);
        const guestCount = parseInt(searchData.adults) || 0;

        const response = await fetch(`${API_BASE_URI}${API_ENDPOINTS.SEARCH_EVENTS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
          body: JSON.stringify({
            eventType: searchData.eventType,
            destination: searchData.destination,
            guestCount: guestCount,
            eventStartDate: eventStartDate,
            eventEndDate: eventEndDate,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const result = await response.json();

        if (result.status === 200 && Array.isArray(result.data)) {
          const mappedEvents: Event[] = result.data.map((item: ApiEventResponse) => ({
            id: item.event.event_ID,
            name: item.hotel.name,
            type: item.event.eventType,
            destination: item.hotel.destination,
            rating: 4.5, // Default rating as API doesn't provide it
            pricePerEvent: 0, // API doesn't provide price in response
            capacity: item.event.guestCount,
            date: searchData.checkIn,
            time: "00:00", // Default time
            amenities: [
              ...(item.hotel.hotelAmenities || []).map((name: string) => ({ name, icon: "🏨" })),
              ...(item.event.eventAmenities || []).map((name: string) => ({ name, icon: "🎉" })),
            ],
            images: item.hotel.image ? [item.hotel.image] : [],
            description: "",
            tags: [item.hotel.type],
            hotelId: item.hotel.hotel_ID,
          }));

          setEvents(mappedEvents);
        } else {
          setEvents([]);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching events");
        setEvents([]);
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [searchData.destination, searchData.checkIn, searchData.checkOut, searchData.eventType, searchData.adults]);

  const filteredEvents = events.filter(event => {
    // Price filter (one directional: 0 to maxPrice)
    const price = event.pricePerEvent || 0;
    if (price > maxPrice) return false;

    // Event type filter
    if (eventTypes.length > 0 && !eventTypes.includes(event.type)) return false;

    // Amenities filter
    if (
      amenities.length > 0 &&
      !amenities.every(a => event.amenities.some((am) => am.name === a))
    ) return false;

    return true;
  });

  return (
    <>
      <EventSearchSummary searchData={searchData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 h-screen min-h-0">
          <EventFilterSidebar
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            eventTypes={eventTypes}
            setEventTypes={setEventTypes}
            amenities={amenities}
            setAmenities={setAmenities}
          />
          {isLoading ? (
            <div className="flex-1 h-full overflow-y-auto">
              <ResultsSkeleton count={6} />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <EventResults events={filteredEvents} />
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResultForEvent;
