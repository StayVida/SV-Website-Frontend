import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Baby, Search } from "lucide-react";

const BookingSearchForm = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm p-2 sm:p-4 md:p-6 rounded-xl shadow-hover">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4">
        {/* Destination */}
        <div className="md:col-span-1">
          <Label htmlFor="destination" className="text-sm md:text-base font-medium text-gray-700 mb-2 block">
            Destination
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
            <Input
              id="destination"
              placeholder="Where are you going?"
              className="pl-10 h-10 md:h-12 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Check In & Check Out (row on mobile) */}
        <div className="flex flex-row gap-2 w-full md:contents">
          <div className="flex-1 md:col-span-1">
            <Label htmlFor="checkin" className="text-sm md:text-base font-medium text-gray-700 mb-2 block">
              Check In
            </Label>
            <div className="relative">
              <CalendarDays className="absolute left-2 top-3 md:top-4 w-4 h-4 text-gray-400" />
              <Input
                id="checkin"
                type="date"
                className="pl-7 h-10 md:h-12 text-sm md:text-base"
              />
            </div>
          </div>
          <div className="flex-1 md:col-span-1">
            <Label htmlFor="checkout" className="text-sm md:text-base font-medium text-gray-700 mb-2 block">
              Check Out
            </Label>
            <div className="relative">
              <CalendarDays className="absolute left-2 top-3 md:top-4 w-4 h-4 text-gray-400" />
              <Input
                id="checkout"
                type="date"
                className="pl-7 h-10 md:h-12 text-sm md:text-base"
              />
            </div>
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

        {/* Children */}
        <div className="md:col-span-1">
          <Label htmlFor="children" className="text-sm font-medium text-gray-700 mb-2 block">
            Children
          </Label>
          <div className="relative">
            <Baby className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
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
          <Button variant="booking" className="w-full h-10 md:h-12 text-sm md:text-base">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookingSearchForm; 