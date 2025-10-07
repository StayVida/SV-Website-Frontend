import { Card, CardContent } from "@/components/ui/card";
import { Building,CalendarIcon,  } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesCard = () => {

  return (
    <section className="py-12 lg:py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 lg:text-center lg:mb-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 lg:gap-8 justify-center mx-auto max-w-4xl">
        <Card className="text-center p-4 lg:p-8 hover:shadow-lg transition-shadow">
          <CardContent className="space-y-2 lg:space-y-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <Building className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold">Hotel Booking</h3>
            <p className="text-sm lg:text-base text-gray-600">
              Find and book the perfect stay from our curated collection of hotels.
            </p>
            <Link
              to="#"
              className="text-green-600 hover:text-green-700 font-medium text-sm lg:text-base"
            >
              Learn More →
            </Link>
          </CardContent>
        </Card>

        {/* <Card className="text-center p-4 lg:p-8 hover:shadow-lg transition-shadow">
          <CardContent className="space-y-2 lg:space-y-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <Car className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold">
              <span className="lg:hidden">Pickup</span>
              <span className="hidden lg:inline">Pickup & Drop</span>
            </h3>
            <p className="text-sm lg:text-base text-gray-600 hidden lg:block">
              Door-to-door transportation service for seamless travel experience.
            </p>
            <p className="text-sm text-gray-600 lg:hidden">Hassle Free</p>
            <Link
              to="#"
              className="text-green-600 hover:text-green-700 font-medium text-sm lg:text-base hidden lg:inline"
            >
              Learn More →
            </Link>
          </CardContent>
        </Card> */}

        <Card className="text-center p-4 lg:p-8 hover:shadow-lg transition-shadow">
          <CardContent className="space-y-2 lg:space-y-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <CalendarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold">Event Management</h3>
            <p className="text-sm lg:text-base text-gray-600">
              End-to-end event planning and execution services for any occasion.
            </p>
            <Link to="#" className="text-green-600 hover:text-green-700 font-medium text-sm lg:text-base">
              Learn More →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
  );
};

export default ServicesCard;