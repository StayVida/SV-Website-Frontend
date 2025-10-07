import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  Car, 
  Utensils, 
  Music, 
  Camera, 
  Palette, 
  Shield, 
  Lightbulb,
  Coffee,
  Gift
} from "lucide-react";

interface Event {
  amenities: Array<{ name: string; icon: string }>;
}

interface AmenitiesProps {
  event: Event;
}

function Amenities({ event }: AmenitiesProps) {
  const getAmenityIcon = (amenityName: string) => {
    const iconMap: { [key: string]: any } = {
      'WiFi': Wifi,
      'Parking': Car,
      'Catering': Utensils,
      'Music': Music,
      'Photography': Camera,
      'Decoration': Palette,
      'Security': Shield,
      'Lighting': Lightbulb,
      'Breakfast': Coffee,
      'Dinner': Utensils,
      'Valet Parking': Car,
      'Projector': Lightbulb,
      'Air Conditioning': Lightbulb,
      'Games': Gift,
    };
    
    return iconMap[amenityName] || Utensils;
  };

  const getAmenityDescription = (amenityName: string) => {
    const descriptions: { [key: string]: string } = {
      'WiFi': 'High-speed internet access throughout the venue',
      'Parking': 'Complimentary parking available for all guests',
      'Catering': 'Professional catering services included',
      'Music': 'Sound system and music equipment provided',
      'Photography': 'Professional photography services available',
      'Decoration': 'Beautiful decorations and floral arrangements',
      'Security': '24/7 security services for your event',
      'Lighting': 'Professional lighting setup included',
      'Breakfast': 'Complimentary breakfast service',
      'Dinner': 'Fine dining options available',
      'Valet Parking': 'Complimentary valet parking service',
      'Projector': 'Audio-visual equipment for presentations',
      'Air Conditioning': 'Climate-controlled environment',
      'Games': 'Entertainment and games for guests',
    };
    
    return descriptions[amenityName] || 'Premium amenity included with your booking';
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {event.amenities.map((amenity, index) => {
            const IconComponent = getAmenityIcon(amenity.name);
            return (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{amenity.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {getAmenityDescription(amenity.name)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services Note */}
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Gift className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Additional Services</h3>
              <p className="text-gray-600 text-sm">
                Need something specific for your event? Our team can arrange additional services 
                including custom decorations, specialized catering, entertainment, and more. 
                Contact us to discuss your requirements.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Amenities;
