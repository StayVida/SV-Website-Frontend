import { Link } from "react-router-dom"
import { Card,CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin,Star, } from "lucide-react"

function FeaturedProperties() {
  const featuredProperties = [
    {
      image: "/placeholder.svg?height=200&width=300",
      title: "Grand Plaza Hotel",
      location: "Bhubaneswar, Pune",
      rating: 4.8,
      price: 3000,
      link: "#",
    },
    {
      image: "/placeholder.svg?height=200&width=300",
      title: "Royal Orchid",
      location: "Mumbai, Maharashtra",
      rating: 4.7,
      price: 3500,
      link: "#",
    },
    {
      image: "/placeholder.svg?height=200&width=300",
      title: "Sunset Resort",
      location: "Goa, India",
      rating: 4.9,
      price: 4200,
      link: "#",
    },
    {
      image: "/placeholder.svg?height=200&width=300",
      title: "City Lights Inn",
      location: "Delhi, India",
      rating: 4.6,
      price: 2800,
      link: "#",
    },
  ];
  return (
    <section className="py-8 px-4 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="#" className="text-green-600 hover:text-green-700 font-medium">
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
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">₹{item.price}</span>
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
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{item.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">₹{item.price}</span>
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