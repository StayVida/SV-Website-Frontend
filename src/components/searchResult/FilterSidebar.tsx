import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Car, Coffee, Utensils, PawPrint, X, Filter } from "lucide-react";
import React, { useState } from "react";

interface FilterSidebarProps {
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  hotelTypes: string[];
  setHotelTypes: (types: string[]) => void;
  amenities: string[];
  setAmenities: (amenities: string[]) => void;
}

const HOTEL_TYPES = ["Villa", "Resort", "Guest House", "Hotel"];
const AMENITIES = [
  { name: "WiFi", icon: Wifi },
  { name: "Pool", icon: Car },
  { name: "Breakfast", icon: Coffee },
  { name: "Dinner", icon: Utensils },
  { name: "Pet Friendly", icon: PawPrint },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  maxPrice,
  setMaxPrice,
  hotelTypes,
  setHotelTypes,
  amenities,
  setAmenities,
}) => {
  const [open, setOpen] = useState(false);
  const handleHotelTypeChange = (type: string, checked: boolean) => {
    if (checked) setHotelTypes([...hotelTypes, type]);
    else setHotelTypes(hotelTypes.filter((t) => t !== type));
  };
  const handleAmenityChange = (name: string, checked: boolean) => {
    if (checked) setAmenities([...amenities, name]);
    else setAmenities(amenities.filter((a) => a !== name));
  };
  return (
    <>
      {/* Mobile: Icon button to open filter */}
      <div className="flex justify-end lg:hidden mb-4">
        <button
          className="bg-white rounded-full shadow py-2 px-4 flex items-center gap-2"
          onClick={() => setOpen(true)}
          aria-label="Open filters"
        >
          <Filter className="w-6 h-6 text-gray-700" />
          <span className="text-lg text-gray-700">Filters</span>
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`lg:w-80 h-full overflow-y-auto ${
          open ? "fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end" : ""
        } lg:static lg:block ${!open ? "hidden" : ""} lg:!block`}
        style={{ transition: "all 0.3s" }}
      >
        <Card className={`sticky top-4 lg:static w-80 h-full bg-white ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300`}
          style={{ maxHeight: "100vh" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              {/* Close button for mobile */}
              <button
                className="block lg:hidden p-1 rounded hover:bg-gray-100 bg-primary"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Price Range</h3>
              <Slider value={[maxPrice]} onValueChange={([v]) => setMaxPrice(v)} max={12000} min={0} step={100} className="mb-4" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹0</span>
                <span>₹{maxPrice}</span>
                <span>₹12,000</span>
              </div>
            </div>
            {/* Hotel Type */}
            <div className="mb-8">
              <h3 className="font-medium mb-4">Hotel Type</h3>
              <div className="space-y-3">
                {HOTEL_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      className="border-primary bg-transparent"
                      checked={hotelTypes.includes(type)}
                      onCheckedChange={(checked) => handleHotelTypeChange(type, checked as boolean)}
                    />
                    <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-4">Amenities</h3>
              <div className="space-y-3">
                {AMENITIES.map((amenity) => (
                  <div key={amenity.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.name}
                      className="border-primary bg-transparent"
                      checked={amenities.includes(amenity.name)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.name, checked as boolean)}
                    />
                    <amenity.icon className="w-4 h-4 text-gray-500" />
                    <label htmlFor={amenity.name} className="text-sm text-gray-700 cursor-pointer">
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Apply button for mobile only */}
            <button
              className="mt-8 w-full bg-primary text-white py-2 rounded block lg:hidden"
              onClick={() => setOpen(false)}
            >
              Apply
            </button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FilterSidebar; 