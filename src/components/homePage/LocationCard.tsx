import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Hotel, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { normalizeImages } from "@/utils/imageUtils";

interface LocationCardProps {
  city: {
    location: string;
    lowestPrice: number | null;
    hotelCount: number;
    images: string[];
  };
  onClick: () => void;
}

export function LocationCard({ city, onClick }: LocationCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = normalizeImages(city.images);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img
          src={images[currentImageIndex]}
          alt={city.location}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
        
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-700">
            {city.hotelCount} hotels
          </div>
        </div>

        {/* Image Navigation Arrows */}
        {images.length > 1 && isHovered && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 h-8 w-8 rounded-full p-0 z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4 text-gray-900" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 h-8 w-8 rounded-full p-0 z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4 text-gray-900" />
            </Button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className="font-semibold text-lg text-gray-900">{city.location}</h3>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Hotel className="w-4 h-4 mr-1" />
            <span>{city.hotelCount} hotels</span>
          </div>
          <span className="font-medium">₹{(city.lowestPrice ?? 0).toLocaleString()}/night</span>
        </div>
      </CardContent>
    </Card>
  );
}
