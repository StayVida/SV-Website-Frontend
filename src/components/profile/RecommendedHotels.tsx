import { MapPin, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface RecommendedHotel {
  id: string;
  name: string;
  destination: string;
  rating: number;
  price?: number;
  imageUrl?: string | null;
}

interface RecommendedHotelsProps {
  hotels: RecommendedHotel[];
  isLoading: boolean;
  error: string | null;
}

export const RecommendedHotels = ({
  hotels,
  isLoading,
  error,
}: RecommendedHotelsProps) => {
  const renderHotelCard = (hotel: RecommendedHotel) => (
    <Card key={hotel.id} className="h-full overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-44 w-full bg-gray-100">
        <img
          src={hotel.imageUrl ?? "/placeholder.svg?height=240&width=320"}
          alt={hotel.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            (event.target as HTMLImageElement).src = "/placeholder.svg?height=240&width=320";
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{hotel.name}</CardTitle>
        <CardDescription className="flex items-center text-gray-600">
          <MapPin className="mr-1.5 h-4 w-4 text-gray-400 shrink-0" />
          <span className="truncate">{hotel.destination}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-gray-700">{hotel.rating > 0 ? hotel.rating.toFixed(1) : "New"}</span>
          </div>
          {typeof hotel.price === "number" && (
            <span className="text-sm font-bold text-gray-900">₹{Math.round(hotel.price)}/night</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Recommended hotels for you</CardTitle>
        <CardDescription>Discover stays curated specially for your travel style.</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500 font-medium animate-pulse">Loading recommendations…</div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : hotels.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">No recommendations available right now.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {hotels.slice(0, 4).map((hotel) => renderHotelCard(hotel))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
