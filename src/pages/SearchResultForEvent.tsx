import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import EventSearchSummary from "@/components/searchResult/EventSearchSummary";
import EventFilterSidebar from "@/components/searchResult/EventFilterSidebar";
import EventResults from "@/components/searchResult/EventResults";
import eventData from "@/data.json";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  eventType?: string;
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

  // Filter state
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    // Get search parameters from URL search params or route params
    const destination = searchParams.get('destination') || params.destination || "Mumbai, India";
    const checkIn = searchParams.get('checkIn') || params.checkIn || "15 Mar";
    const checkOut = searchParams.get('checkOut') || params.checkOut || "18 Mar";
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

  // Filter events from data.json (events have id starting with "event-")
  const allEvents = (eventData as any[]).filter(item => item.id && item.id.toString().startsWith("event-"));

  // Filtering logic (first by searchData, then by sidebar filters)
  const searchFilteredEvents = allEvents.filter(event => {
    // Destination filter (simple contains, case-insensitive)
    if (searchData.destination && !event.destination.toLowerCase().includes(searchData.destination.toLowerCase())) return false;
    // You can add more searchData-based filters here if needed (e.g., checkIn, checkOut, adults, children)
    return true;
  });

  const filteredEvents = searchFilteredEvents.filter(event => {
    // Price filter (one directional: 0 to maxPrice)
    const price = event.pricePerEvent || 0;
    if (price > maxPrice) return false;
    
    // Event type filter
    if (eventTypes.length > 0 && !eventTypes.includes(event.type)) return false;
    
    // Amenities filter
    if (
      amenities.length > 0 &&
      !amenities.every(a => event.amenities.some((am: { name: string }) => am.name === a))
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
          <EventResults events={filteredEvents} />
        </div>
      </div>
    </>
  );
}

export default SearchResultForEvent;
