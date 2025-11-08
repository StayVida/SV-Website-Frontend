import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Baby} from "lucide-react";

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
}

interface BookingSearchFormProps {
  onSearch?: (searchData: SearchData) => void;
}

const BookingSearchForm = ({ onSearch }: BookingSearchFormProps) => {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: "2",
    children: "0",
  })

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // If onSearch prop is provided, use it instead of navigation
    if (onSearch) {
      onSearch(searchData);
      return;
    }

    // Build path params for navigation (dates already in yyyy-mm-dd from input[type=date])
    const destination = encodeURIComponent(searchData.destination);
    const checkIn = encodeURIComponent(searchData.checkIn);
    const checkOut = encodeURIComponent(searchData.checkOut);
    const adults = encodeURIComponent(searchData.adults);
    const children = encodeURIComponent(searchData.children);
    navigate(`/search/${destination}/${checkIn}/${checkOut}/${adults}/${children}`);
  }
  return (
    <form onSubmit={handleSearch}>
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
                name="destination"
                placeholder="Where are you going?"
                className="pl-10 h-10 md:h-12 text-sm md:text-base"
                value={searchData.destination}
                onChange={e => setSearchData({ ...searchData, destination: e.target.value })}
                required
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
                  name="checkIn"
                  type="date"
                  placeholder="dd/mm/yyyy"
                  className="pl-7 h-10 md:h-12 text-sm md:text-base"
                  value={searchData.checkIn}
                  onChange={e => setSearchData({ ...searchData, checkIn: e.target.value })}
                  required
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
                  name="checkOut"
                  type="date"
                  placeholder="dd/mm/yyyy"
                  className="pl-7 h-10 md:h-12 text-sm md:text-base"
                  value={searchData.checkOut}
                  onChange={e => setSearchData({ ...searchData, checkOut: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Persons */}
          <div className="md:col-span-1">
            <Label htmlFor="adults" className="text-sm font-medium text-gray-700 mb-2 block">
              Persons
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
              <Input
                id="adults"
                name="adults"
                type="number"
                min="1"
                placeholder="Adult Persons"
                className="pl-10 h-12"
                value={searchData.adults}
                onChange={e => setSearchData({ ...searchData, adults: e.target.value })}
                required
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
                name="children"
                type="number"
                min="0"
                placeholder="Children"
                className="pl-10 h-12"
                value={searchData.children}
                onChange={e => setSearchData({ ...searchData, children: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1 flex items-end">
            <Button type="submit" variant="booking" className="w-full h-10 md:h-12 text-sm md:text-base">
              Search
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default BookingSearchForm; 