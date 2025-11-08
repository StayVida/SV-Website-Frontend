import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card,CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin,Star, } from "lucide-react"
import apiClient from "@/api/axios"

interface ApiFeaturedHotel {
  id: number
  name: string
  type: string
  destination: string
  rating: number
  amenities: string[]
  imageUrl: string
  isForEvent: boolean
  price: number
}

interface ApiFeaturedResponse {
  data: ApiFeaturedHotel[]
  message: string
  status: number
}

interface FeaturedProperty {
  image: string
  title: string
  location: string
  rating: number
  price: number
  link: string
}

function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<ApiFeaturedResponse>("/api/hotels/featurelist")
        const data = Array.isArray(response.data?.data) ? response.data.data : []

        const mapped: FeaturedProperty[] = data.map((hotel) => ({
          image: hotel.imageUrl || "/placeholder.svg?height=200&width=300",
          title: hotel.name,
          location: hotel.destination,
          rating: hotel.rating,
          price: hotel.price,
          link: `/hotel/${hotel.id}`,
        }))

        setFeaturedProperties(mapped)
      } catch (e: any) {
        setError(e?.message || "Failed to load featured properties")
        setFeaturedProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])
  if (loading) {
    return (
      <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 w-full bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || featuredProperties.length === 0) {
    return null // Hide section if there's an error or no properties
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
            {featuredProperties.map((item, idx) => (
              <Card
                key={item.title + idx}
                className="min-w-[260px] max-w-[80vw] flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow snap-start"
              >
                <div className="relative h-40">
                  <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{item.location}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= Math.floor(item.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                      <span className="text-gray-600">/night</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link to={item.link}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Grid for md+ screens */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((item, idx) => (
              <Card key={item.title + idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{item.location}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= Math.floor(item.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">₹{item.price.toLocaleString()}</span>
                      <span className="text-gray-600">/night</span>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <Link to={item.link}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default FeaturedProperties