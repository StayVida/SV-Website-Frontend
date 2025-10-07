import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Clock, Users } from "lucide-react";

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
  description: string;
}

interface EventInfoProps {
  event: Event;
}

function EventInfo({ event }: EventInfoProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Flexible";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Flexible";
    return timeString;
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {event.type}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.name}
            </h1>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{event.rating}</span>
                <span className="text-gray-600">(Excellent)</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {event.location ? `${event.location}, ` : ""}{event.destination}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Date: {formatDate(event.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Time: {formatTime(event.time)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  Capacity: Up to {event.capacity} guests
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About this venue
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  ₹{event.pricePerEvent.toLocaleString()}
                </div>
                <div className="text-gray-600 mb-4">per event</div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base price</span>
                    <span>₹{event.pricePerEvent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span>{event.capacity} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span>{event.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventInfo;
