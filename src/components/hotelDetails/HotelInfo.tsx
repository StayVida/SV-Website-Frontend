import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Hotel } from "@/types/hotelType";

interface HotelInfoProps {
  hotel: Hotel;
}

export default function HotelInfo({ hotel }: HotelInfoProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
            {hotel.name}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    star <= Math.floor(hotel.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 font-medium text-sm sm:text-base">{hotel.rating}</span>
              <span className="ml-1 text-gray-600 text-sm sm:text-base">
                ({hotel.rating} reviews)
              </span>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm sm:text-base break-words">{hotel.destination}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:ml-4 lg:justify-end">
          {hotel.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 py-1"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
