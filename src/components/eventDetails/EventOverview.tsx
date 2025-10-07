import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Users, Calendar, Wifi, Car, Utensils, Music } from "lucide-react";

interface Event {
  id: string;
  name: string;
  destination: string;
  location?: string;
  capacity: number;
  date?: string;
  time?: string;
  amenities: Array<{ name: string; icon: string }>;
}

interface EventOverviewProps {
  event: Event;
}

function EventOverview({ event }: EventOverviewProps) {
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

  const getAmenityIcon = (amenityName: string) => {
    const iconMap: { [key: string]: any } = {
      'WiFi': Wifi,
      'Parking': Car,
      'Catering': Utensils,
      'Music': Music,
    };
    
    return iconMap[amenityName] || Utensils;
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Location</div>
                  <div className="text-gray-600">
                    {event.location ? `${event.location}, ` : ""}{event.destination}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Date</div>
                  <div className="text-gray-600">{formatDate(event.date)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Time</div>
                  <div className="text-gray-600">{formatTime(event.time)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Capacity</div>
                  <div className="text-gray-600">Up to {event.capacity} guests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Included Amenities</h3>
            <div className="grid grid-cols-1 gap-3">
              {event.amenities.map((amenity, index) => {
                const IconComponent = getAmenityIcon(amenity.name);
                return (
                  <div key={index} className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{amenity.name}</div>
                      <div className="text-gray-600 text-sm">Included</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Group Size</h4>
              <p className="text-gray-600 text-sm">Perfect for {event.capacity} guests</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Availability</h4>
              <p className="text-gray-600 text-sm">Check calendar for dates</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Location</h4>
              <p className="text-gray-600 text-sm">Prime location in {event.destination}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventOverview;
