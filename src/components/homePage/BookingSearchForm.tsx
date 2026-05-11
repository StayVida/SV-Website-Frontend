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
  variant?: "light" | "glass";
}

const BookingSearchForm = ({ onSearch, variant = "glass" }: BookingSearchFormProps) => {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: "2",
    children: "0",
  })

  const navigate = useNavigate();
  const isLight = variant === "light";

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
      <Card className={isLight ? "bg-white p-2 sm:p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200" : "bg-white/10 backdrop-blur-xl p-2 sm:p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20"}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
          {/* Destination */}
          <div className="lg:col-span-1">
            <Label htmlFor="destination" className={isLight ? "text-sm md:text-base font-medium text-gray-700 mb-2 block" : "text-sm md:text-base font-medium text-white/90 mb-2 block"}>
              Destination
            </Label>
            <div className="relative">
              <MapPin className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="destination"
                name="destination"
                placeholder="Where are you going?"
                className={isLight ? "pl-10 h-10 md:h-12 text-sm md:text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 transition-all" : "pl-10 h-10 md:h-12 text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"}
                value={searchData.destination}
                onChange={e => setSearchData({ ...searchData, destination: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Check In */}
          <div className="lg:col-span-1">
            <Label htmlFor="checkin" className={isLight ? "text-sm md:text-base font-medium text-gray-700 mb-2 block" : "text-sm md:text-base font-medium text-white/90 mb-2 block"}>
              Check In
            </Label>
            <div className="relative">
              <CalendarDays className={isLight ? "absolute left-2 top-3 md:top-4 w-4 h-4 text-gray-500" : "absolute left-2 top-3 md:top-4 w-4 h-4 text-white/70"} />
              <Input
                id="checkin"
                name="checkIn"
                type="date"
                className={isLight ? "pl-7 h-10 md:h-12 text-sm md:text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 transition-all [color-scheme:light]" : "pl-7 h-10 md:h-12 text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all [color-scheme:dark]"}
                value={searchData.checkIn}
                onChange={e => setSearchData({ ...searchData, checkIn: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="lg:col-span-1">
            <Label htmlFor="checkout" className={isLight ? "text-sm md:text-base font-medium text-gray-700 mb-2 block" : "text-sm md:text-base font-medium text-white/90 mb-2 block"}>
              Check Out
            </Label>
            <div className="relative">
              <CalendarDays className={isLight ? "absolute left-2 top-3 md:top-4 w-4 h-4 text-gray-500" : "absolute left-2 top-3 md:top-4 w-4 h-4 text-white/70"} />
              <Input
                id="checkout"
                name="checkOut"
                type="date"
                className={isLight ? "pl-7 h-10 md:h-12 text-sm md:text-base bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 transition-all [color-scheme:light]" : "pl-7 h-10 md:h-12 text-sm md:text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all [color-scheme:dark]"}
                value={searchData.checkOut}
                onChange={e => setSearchData({ ...searchData, checkOut: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Persons */}
          <div className="lg:col-span-1">
            <Label htmlFor="adults" className={isLight ? "text-sm font-medium text-gray-700 mb-2 block" : "text-sm font-medium text-white/90 mb-2 block"}>
              Persons
            </Label>
            <div className="relative">
              <Users className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="adults"
                name="adults"
                type="number"
                min="1"
                placeholder="Adult Persons"
                className={isLight ? "pl-10 h-10 md:h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 transition-all" : "pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"}
                value={searchData.adults}
                onChange={e => setSearchData({ ...searchData, adults: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Children */}
          <div className="lg:col-span-1">
            <Label htmlFor="children" className={isLight ? "text-sm font-medium text-gray-700 mb-2 block" : "text-sm font-medium text-white/90 mb-2 block"}>
              Children
            </Label>
            <div className="relative">
              <Baby className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="children"
                name="children"
                type="number"
                min="0"
                placeholder="Children"
                className={isLight ? "pl-10 h-10 md:h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 transition-all" : "pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"}
                value={searchData.children}
                onChange={e => setSearchData({ ...searchData, children: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1 flex items-end">
            <Button type="submit" variant="booking" className="w-full h-10 md:h-12 text-sm md:text-base shadow-lg hover:shadow-primary/50 transition-all duration-300">
              Search
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default BookingSearchForm; 