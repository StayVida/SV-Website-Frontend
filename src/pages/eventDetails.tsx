import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import eventData from "@/data.json";
import ImageGallery from "@/components/eventDetails/ImageGallery";
import EventInfo from "@/components/eventDetails/EventInfo";
import EventOverview from "@/components/eventDetails/EventOverview";
import Amenities from "@/components/eventDetails/Amenities";
import EventBookingSidebar from "@/components/eventDetails/EventBookingSidebar";

interface Event {
  id: string;
  name: string;
  type: string;
  destination: string;
  location?: string;
  rating: number;
  pricePerEvent: number;
  capacity: number;
  date?: string;
  time?: string;
  tags: string[];
  amenities: Array<{ name: string; icon: string }>;
  images: string[];
  description: string;
  isForEvent: boolean;
}

function EventDetails() {
  const { id, checkIn, checkOut, persons, eventType } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Find event data from JSON
    const foundEvent = (eventData as any[]).find((e) => e.id.toString() === id && e.isForEvent === true);
    if (foundEvent) {
      setEvent(foundEvent);
      setNotFound(false);
    } else {
      setEvent(null);
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    // Prepare a sample object for user to add to data.json
    const newEvent: Event = {
      id: id || "event-new",
      name: "New Event Venue",
      type: "Wedding",
      destination: "City, Country",
      location: "Venue Location",
      rating: 4.0,
      pricePerEvent: 100000,
      capacity: 100,
      date: "2024-04-01",
      time: "18:00",
      tags: ["Sample Tag"],
      amenities: [
        { name: "Catering", icon: "🍽️" },
        { name: "Music", icon: "🎵" }
      ],
      images: ["/images/sample-event-1.jpg", "/images/sample-event-2.jpg"],
      description: "Description for the new event venue.",
      isForEvent: true
    };
    return (
      <div className="p-8 text-center text-gray-500">
        <div>Event not found for id: {id}</div>
        <div className="mt-4 text-left max-w-xl mx-auto">
          <div className="font-bold mb-2">To add this event, copy the following object into data.json:</div>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(newEvent, null, 2)}</pre>
        </div>
      </div>
    );
  }

  if (!event) {
    return <div className="p-8 text-center text-gray-500">Loading event details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ImageGallery event={event} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventInfo event={event} />
          <EventOverview event={event} />
          <Amenities event={event} />
        </div>
        <EventBookingSidebar 
          event={event}
          checkIn={checkIn || ""}
          checkOut={checkOut || ""}
          persons={persons || ""}
          eventType={eventType || ""}
        />
      </div>
    </div>
  );
}

export default EventDetails;