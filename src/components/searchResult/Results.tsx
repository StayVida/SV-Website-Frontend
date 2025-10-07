import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Amenity {
  name: string;
  icon: string; // emoji character from data.json
}

interface Hotel {
  id: number;
  name: string;
  type: string;
  destination: string;
  location?: string;
  rating: number;
  pricePerNight: number;
  amenities: Amenity[];
  images: string[];
}

interface ResultsProps {
  hotels: Hotel[];
}

const Results: React.FC<ResultsProps> = ({ hotels }) => {
  const navigate = useNavigate();
  const { checkIn, checkOut, adults, children } = useParams();
  return (
    <div className="flex-1 h-full overflow-y-auto">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">{hotels.length} properties found</h2>
        {/* Sorting UI can be added here if needed */}
      </div>
      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={hotel.images && hotel.images[0] ? hotel.images[0] : "/placeholder.svg"}
                alt={hotel.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{hotel.name}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{hotel.destination}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {(hotel.amenities || []).slice(0, 3).map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                    <span className="mr-1">{amenity.icon}</span>
                    {amenity.name}
                  </span>
                ))}
                {(hotel.amenities?.length || 0) > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">...</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">₹{hotel.pricePerNight?.toLocaleString()}</span>
                  <span className="text-gray-600 text-sm">/night</span>
                </div>
                <Button className="bg-primary hover:bg-primary/80 text-white" onClick={() => navigate(`/hotel/${hotel.id}/${checkIn}/${checkOut}/${adults}/${children}`)}>View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" className="px-8 bg-transparent">
          Load More Properties
        </Button>
      </div>
    </div>
  );
};

export default Results; 