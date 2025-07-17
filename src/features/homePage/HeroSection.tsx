import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Baby, Search } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div
          className="absolute inset-0 w-full"
          style={{
            background: "linear-gradient(135deg, hsl(240 16% 12% / 0.9), hsl(240 16% 12% / 0.7))"
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 md:w-4/5 mx-auto px-0 pt-25 pb-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-6">
            Discover Local Stays &
            <br />
            Event Friendly Hotels
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl">
            Stay, Travel, Celebrate - All in one platform
          </p>
          
          {/* CTA Buttons */}
          <div className="w-full flex flex-row gap-4 items-center mb-12">
            <Button
              variant="hero"
              size="lg"
              className="w-1/2 sm:w-auto"
            >
              Explore Hotels
            </Button>
            <Button
              variant="outlineWhite"
              size="lg"
              className="w-1/2 sm:w-auto"
            >
              Plan an Event
            </Button>
          </div>

          {/* Booking Search Form */}
          <Card className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-hover">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Destination */}
              <div className="md:col-span-1">
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 block">
                  Destination
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="Where are you going?"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Check In */}
              <div className="md:col-span-1">
                <Label htmlFor="checkin" className="text-sm font-medium text-gray-700 mb-2 block">
                  Check In
                </Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="checkin"
                    type="date"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Check Out */}
              <div className="md:col-span-1">
                <Label htmlFor="checkout" className="text-sm font-medium text-gray-700 mb-2 block">
                  Check Out
                </Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="checkout"
                    type="date"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Persons */}
              <div className="md:col-span-1">
                <Label htmlFor="persons" className="text-sm font-medium text-gray-700 mb-2 block">
                  Persons
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="persons"
                    type="number"
                    min="1"
                    placeholder="Adult Persons"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Children */}
              <div className="md:col-span-1">
                <Label htmlFor="children" className="text-sm font-medium text-gray-700 mb-2 block">
                  Children
                </Label>
                <div className="relative">
                  <Baby className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    placeholder="Children"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <Button variant="booking" className="w-full h-12">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;