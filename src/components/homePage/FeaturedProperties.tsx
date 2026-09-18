import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star } from "lucide-react"
import apiClient from "@/api/axios"
import { API_ENDPOINTS } from "@/config/api"

interface Hotel {
  id: string;
  name: string;
  type: string;
  destination: string;
  rating: number;
  amenities: string[];
  image: string | null;
  isForEvent: boolean;
  "base price": number;
}

interface ApiResponse {
  data: Hotel[];
  message: string;
  status: number;
}

function FeaturedProperties() {
  const { data: featuredProperties = [], isLoading, error } = useQuery<Hotel[], Error>({
    queryKey: ['featuredHotels'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse>(API_ENDPOINTS.FEATURED_HOTELS);
      if (response.data.status === 200) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      }
      throw new Error(response.data.message || "Failed to fetch featured hotels");
    }
  });

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return { fullStars, hasHalfStar };
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (imageUrl) {
      return imageUrl;
    }
    return "/placeholder.svg?height=200&width=300";
  };

  const getHotelLink = (hotel: any) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const checkIn = formatDate(today);
    const checkOut = formatDate(tomorrow);
    const adults = "2";
    const children = "0";
    
    const propType = (hotel.type || "hotels").toLowerCase() + "s";
    const slug = (hotel.name || "hotel").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return `/${propType}/${hotel.id}_${slug}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&adults=${adults}&children=${children}`;
  };
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Horizontal scrollable cards for mobile */}
          <div className="flex md:hidden gap-4 overflow-x-auto pb-2 -mx-2 px-4">
            {[1, 2, 3].map((i) => (
              <Card key={`mobile-skeleton-${i}`} className="min-w-[260px] max-w-[80vw] flex-shrink-0 overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Grid for md+ screens */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={`desktop-skeleton-${i}`} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

  if (!Array.isArray(featuredProperties) || featuredProperties.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link href="/hotels" className="text-green-600 hover:text-green-700 font-medium">
            View All →
          </Link>
        </div>

        {/* Horizontal scrollable cards for mobile */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-2 px-4">
          {Array.isArray(featuredProperties) && featuredProperties.map((hotel) => {
            const { fullStars } = getStarRating(hotel.rating || 0);
            return (
              <Card
                key={hotel.id}
                className="min-w-[260px] max-w-[80vw] flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow snap-start"
              >
                <div className="relative h-40">
                  <img
                    src={getImageUrl(hotel.image)}
                    alt={`${hotel.name} in ${hotel.destination}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300";
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{hotel.destination}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= fullStars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{(hotel.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-red-500 line-through mb-1 font-medium">
                        ₹{Math.round(hotel["base price"] * 1.1)}
                      </div>
                      <span className="text-2xl font-bold">₹{Math.round(hotel["base price"])}</span>
                      <span className="text-gray-600">/night</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href={getHotelLink(hotel)}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Grid for md+ screens */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(featuredProperties) && featuredProperties.map((hotel) => {
            const { fullStars } = getStarRating(hotel.rating || 0);
            return (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={getImageUrl(hotel.image)}
                    alt={hotel.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300";
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{hotel.destination}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= fullStars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{(hotel.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-red-500 line-through mb-1 font-medium">
                        ₹{Math.round(hotel["base price"] * 1.1)}<span className="text-gray-600 text-sm">/night</span>
                      </div>
                      <span className="text-2xl font-bold">₹{Math.round(hotel["base price"])}</span>
                      <span className="text-gray-600">/night</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link href={getHotelLink(hotel)}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
