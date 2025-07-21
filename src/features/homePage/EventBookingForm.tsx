import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Search, Hotel } from "lucide-react";

const eventTypes = [
  "Wedding",
  "Birthday",
  "Conference",
  "Party",
  "Other"
];

const EventBookingForm = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm p-2 sm:p-4 md:p-6 rounded-xl shadow-hover">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
        {/* Event Type */}
        <div className="md:col-span-1">
          <Label htmlFor="eventType" className="text-sm md:text-base font-medium text-gray-700 mb-2 block">
            Event Type
          </Label>
          <div className="relative">
            <Hotel className="absolute left-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              name="eventType"
              id="eventType"
              aria-label="Event Type"
              className="h-10 md:h-12 w-full pl-10 pr-10 rounded-md border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-black bg-white appearance-none text-sm md:text-base"
              defaultValue=""
            >
              <option value="" disabled>
                Select event type
              </option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {/* Dropdown icon */}
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Destination */}
        <div className="md:col-span-1">
          <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 block">
            Destination
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
            <Input
              id="destination"
              placeholder="Where is your event?"
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
            <CalendarDays className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
            <Input
              id="checkin"
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
            <Users className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
            <Input
              id="persons"
              type="number"
              min="1"
              placeholder="Adult Persons"
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-1 flex items-end">
          <Button variant="booking" className="w-full h-10 md:h-12 text-sm md:text-base">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventBookingForm; 