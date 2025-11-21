import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card,CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin,Star } from "lucide-react"
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api"

interface Hotel {
  id: number;
  name: string;
  type: string;
  destination: string;
  rating: number;
  amenities: string[];
  imageUrl: string | null;
  isForEvent: boolean;
  price: number;
}

interface ApiResponse {
  data: Hotel[];
  message: string;
  status: number;
}

function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URI}${API_ENDPOINTS.FEATURED_HOTELS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch featured hotels");
        }

        const result: ApiResponse = await response.json();
        
        if (result.status === 200 && result.data) {
          setFeaturedProperties(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch featured hotels");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching featured hotels");
        console.error("Error fetching featured hotels:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

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

  const getHotelLink = (hotelId: number) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const checkIn = formatDate(today);
    const checkOut = formatDate(tomorrow);
    const adults = "2";
    const children = "0";
    
    return `/hotel/${hotelId}/${encodeURIComponent(checkIn)}/${encodeURIComponent(checkOut)}/${adults}/${children}`;
  };
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Loading featured properties...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProperties.length === 0) {
    return (
      <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">No featured properties available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/hotels" className="text-green-600 hover:text-green-700 font-medium">
              View All →
            </Link>
          </div>

          {/* Horizontal scrollable cards for mobile */}
          <div className="flex md:hidden gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-2 px-4">
            {featuredProperties.map((hotel) => {
              const { fullStars } = getStarRating(hotel.rating);
              return (
                <Card
                  key={hotel.id}
                  className="min-w-[260px] max-w-[80vw] flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow snap-start"
                >
                  <div className="relative h-40">
                    <img 
                      src={getImageUrl(hotel.imageUrl)} 
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
                    {hotel.rating > 0 && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${
                                star <= fullStars 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{hotel.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">₹{Math.round(hotel.price)}</span>
                        <span className="text-gray-600">/night</span>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700" asChild>
                        <Link to={getHotelLink(hotel.id)}>Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Grid for md+ screens */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((hotel) => {
              const { fullStars } = getStarRating(hotel.rating);
              return (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={getImageUrl(hotel.imageUrl)} 
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
                    {hotel.rating > 0 && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${
                                star <= fullStars 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{hotel.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">₹{Math.round(hotel.price)}</span>
                        <span className="text-gray-600">/night</span>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700" asChild>
                        <Link to={getHotelLink(hotel.id)}>Book Now</Link>
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