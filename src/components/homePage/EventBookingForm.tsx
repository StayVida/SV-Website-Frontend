import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Calendar } from "lucide-react";

interface SearchData {
  eventType: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  persons: string;
}

interface EventBookingFormProps {
  onSearch?: (searchData: SearchData) => void;
  variant?: "light" | "glass";
}

const eventTypes = [
  "Wedding",
  "Birthday",
  "Conference",
  "Party",
  "Corporate",
  "Social"
];

const EventBookingForm = ({ onSearch, variant = "glass" }: EventBookingFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventType: "",
    destination: "",
    checkIn: "",
    checkOut: "",
    persons: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLight = variant === "light";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.eventType) {
      newErrors.eventType = "Please select an event type";
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = "Please enter a destination";
    }
    
    if (!formData.checkIn) {
      newErrors.checkIn = "Please select check-in date";
    }
    
    if (!formData.checkOut) {
      newErrors.checkOut = "Please select check-out date";
    }
    
    if (!formData.persons || parseInt(formData.persons) < 1) {
      newErrors.persons = "Please enter number of persons";
    }
    
    // Check if check-out is after check-in
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = "Check-out must be after check-in";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If onSearch prop is provided, use it instead of navigation
      if (onSearch) {
        onSearch(formData);
        return;
      }

      // Navigate to event search results with query parameters
      const queryParams = new URLSearchParams({
        destination: formData.destination,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        persons: formData.persons,
        eventType: formData.eventType,
      });
      
      navigate(`/events/search?${queryParams.toString()}`);
    }
  };

  return (
    <Card className={isLight ? "bg-white p-2 sm:p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200" : "bg-white/10 backdrop-blur-xl p-2 sm:p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20"}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
          {/* Event Type */}
          <div className="lg:col-span-1">
            <Label htmlFor="eventType" className={isLight ? "text-sm md:text-base font-medium text-gray-700 mb-2 block" : "text-sm md:text-base font-medium text-white/90 mb-2 block"}>
              Event Type
            </Label>
            <div className="relative">
              <Calendar className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500 pointer-events-none" : "absolute left-3 top-4 w-4 h-4 text-white/70 pointer-events-none"} />
              <select
                name="eventType"
                id="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                aria-label="Event Type"
                className={`h-10 md:h-12 w-full pl-10 pr-10 rounded-md border transition-all ${
                  errors.eventType 
                    ? 'border-red-500 bg-red-500/10 text-red-500' 
                    : isLight 
                      ? 'bg-white border-gray-300 text-gray-900 focus:bg-gray-50 focus:border-gray-400 focus:ring-1 focus:ring-gray-300'
                      : 'border-white/20 bg-white/10 text-white focus:border-white/40 focus:ring-2 focus:ring-white/10'
                } appearance-none text-sm md:text-base`}
              >
                <option value="" disabled className={isLight ? "text-gray-500" : "bg-gray-900 text-white"}>
                  Select event type
                </option>
                {eventTypes.map((type) => (
                  <option key={type} value={type} className={isLight ? "text-gray-900" : "bg-gray-900 text-white"}>
                    {type}
                  </option>
                ))}
              </select>
              {/* Dropdown icon */}
              <svg
                className={isLight ? "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" : "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none"}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {errors.eventType && (
              <p className="text-red-400 text-xs mt-1">{errors.eventType}</p>
            )}
          </div>

          {/* Destination */}
          <div className="lg:col-span-1">
            <Label htmlFor="destination" className={isLight ? "text-sm font-medium text-gray-700 mb-2 block" : "text-sm font-medium text-white/90 mb-2 block"}>
              Destination
            </Label>
            <div className="relative">
              <MapPin className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Where is your event?"
                className={`pl-10 h-10 md:h-12 transition-all ${
                  isLight 
                    ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50' 
                    : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20'
                } ${
                  errors.destination ? 'border-red-500 bg-red-500/10 text-red-500' : ''
                }`}
              />
            </div>
            {errors.destination && (
              <p className="text-red-400 text-xs mt-1">{errors.destination}</p>
            )}
          </div>

          {/* Check In */}
          <div className="lg:col-span-1">
            <Label htmlFor="checkin" className={isLight ? "text-sm font-medium text-gray-700 mb-2 block" : "text-sm font-medium text-white/90 mb-2 block"}>
              Event Date
            </Label>
            <div className="relative">
              <CalendarDays className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="checkin"
                name="checkIn"
                type="date"
                value={formData.checkIn}
                onChange={handleInputChange}
                className={`pl-10 h-10 md:h-12 transition-all ${
                  isLight 
                    ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 [color-scheme:light]' 
                    : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 [color-scheme:dark]'
                } ${
                  errors.checkIn ? 'border-red-500 bg-red-500/10 text-red-500' : ''
                }`}
              />
            </div>
            {errors.checkIn && (
              <p className="text-red-400 text-xs mt-1">{errors.checkIn}</p>
            )}
          </div>

          {/* Check Out */}
          <div className="lg:col-span-1">
            <Label htmlFor="checkout" className={isLight ? "text-sm font-medium text-gray-700 mb-2 block" : "text-sm font-medium text-white/90 mb-2 block"}>
              End Date
            </Label>
            <div className="relative">
              <CalendarDays className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="checkout"
                name="checkOut"
                type="date"
                value={formData.checkOut}
                onChange={handleInputChange}
                className={`pl-10 h-10 md:h-12 transition-all ${
                  isLight 
                    ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 [color-scheme:light]' 
                    : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 [color-scheme:dark]'
                } ${
                  errors.checkOut ? 'border-red-500 bg-red-500/10 text-red-500' : ''
                }`}
              />
            </div>
            {errors.checkOut && (
              <p className="text-red-400 text-xs mt-1">{errors.checkOut}</p>
            )}
          </div>

          {/* Persons */}
          <div className="lg:col-span-1">
            <Label htmlFor="persons" className={isLight ? "text-sm font-medium text-gray-700 mb-2 block" : "text-sm font-medium text-white/90 mb-2 block"}>
              Guests
            </Label>
            <div className="relative">
              <Users className={isLight ? "absolute left-3 top-4 w-4 h-4 text-gray-500" : "absolute left-3 top-4 w-4 h-4 text-white/70"} />
              <Input
                id="persons"
                name="persons"
                type="number"
                min="1"
                value={formData.persons}
                onChange={handleInputChange}
                placeholder="Number of guests"
                className={`pl-10 h-10 md:h-12 transition-all ${
                  isLight 
                    ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50' 
                    : 'bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20'
                } ${
                  errors.persons ? 'border-red-500 bg-red-500/10 text-red-500' : ''
                }`}
              />
            </div>
            {errors.persons && (
              <p className="text-red-400 text-xs mt-1">{errors.persons}</p>
            )}
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1 flex items-end">
            <Button 
              type="submit"
              variant="booking" 
              className="w-full h-10 md:h-12 text-sm md:text-base shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              Search Events
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default EventBookingForm; 