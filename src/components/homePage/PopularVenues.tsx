import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";

function PopularVenues() {
  return (
    <section className="py-6 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Venues
          </h2>
        </div>

        {/* Horizontal scroll for mobile */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-2 px-2">
          {[
            {
              name: "Grand Plaza 1",
              capacity: "200-300 guests",
              location: "Downtown",
            },
            {
              name: "Grand Plaza 2",
              capacity: "150-250 guests",
              location: "City Center",
            },
            {
              name: "Grand Plaza 3",
              capacity: "300-400 guests",
              location: "Uptown",
            },
            {
              name: "Grand Plaza 4",
              capacity: "100-200 guests",
              location: "Suburbs",
            },
          ].map((venue, index) => (
            <Card
              key={index}
              className="min-w-[260px] max-w-[80vw] flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow snap-start"
            >
              <div className="relative h-40">
                <img
                  src={`/placeholder.svg?height=200&width=300&query=elegant event venue ${
                    index + 1
                  }`}
                  alt={venue.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{venue.name}</h3>
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {venue.capacity}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {venue.location}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  Quick View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grid for md+ screens */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Grand Plaza 1",
              capacity: "200-300 guests",
              location: "Downtown",
            },
            {
              name: "Grand Plaza 2",
              capacity: "150-250 guests",
              location: "City Center",
            },
            {
              name: "Grand Plaza 3",
              capacity: "300-400 guests",
              location: "Uptown",
            },
            {
              name: "Grand Plaza 4",
              capacity: "100-200 guests",
              location: "Suburbs",
            },
          ].map((venue, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={`/placeholder.svg?height=200&width=300&query=elegant event venue ${
                    index + 1
                  }`}
                  alt={venue.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{venue.name}</h3>
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {venue.capacity}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {venue.location}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  Quick View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularVenues;
