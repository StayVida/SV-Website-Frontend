import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Amenity {
  name: string;
  icon: string; // emoji character from data.json
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
  amenities: Amenity[];
  images: string[];
  description: string;
  tags: string[];
}

interface EventResultsProps {
  events: Event[];
}

const EventResults: React.FC<EventResultsProps> = ({ events }) => {
  const navigate = useNavigate();
  const { checkIn, checkOut, adults, children, eventType } = useParams();
  
  // const formatDate = (dateStr: string) => {
  //   if (!dateStr) return "";
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString('en-US', { 
  //     month: 'short', 
  //     day: 'numeric', 
  //     year: 'numeric' 
  //   });
  // };
  
  return (
    <div className="flex-1 h-full overflow-y-auto">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
          {events.length} venues found
        </h2>
        {/* Sorting UI can be added here if needed */}
      </div>
      
      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40">
              <img
                src={event.images && event.images[0] ? event.images[0] : "/placeholder.svg"}
                alt={event.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {event.type}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium">{event.rating}</span>
                </div>
              </div>
            </div>
            
            <CardContent className="py-2 px-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{event.name}</h3>
              </div>
              
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 text-gray-800 mr-1" />
                <span className="text-sm text-gray-600">{event.destination}</span>
                {/* {event.location && (
                  <span className="text-sm text-gray-500 ml-1">• {event.location}</span>
                )} */}
              </div>
              <div className="flex items-center mb-3">
                <Users className="w-4 h-4 text-gray-800 mr-1" />
                <span className="text-sm text-gray-900">{event.capacity} guests</span>
              </div>
              {/* <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{formatDate(event.date)}</span>
                <Clock className="w-4 h-4 text-gray-400 ml-3 mr-1" />
                <span className="text-sm text-gray-600">{event.time}</span>
              </div> */}
              
              
              
              <div className="flex flex-wrap gap-1 mb-4">
                {(event.amenities || []).slice(0, 3).map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    <span className="mr-1">{amenity.icon}</span>
                    {amenity.name}
                  </span>
                ))}
                {(event.amenities?.length || 0) > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    +{(event.amenities?.length || 0) - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{event.pricePerEvent.toLocaleString()}
                  </span>
                  {/* <span className="text-gray-600 text-sm"></span> */}
                </div>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  onClick={() => navigate(`/event/${event.id}/${checkIn}/${checkOut}/${adults}/${children || ''}/${eventType || ''}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" className="px-8 bg-transparent">
          Load More Venues
        </Button>
      </div>
    </div>
  );
};

export default EventResults;
