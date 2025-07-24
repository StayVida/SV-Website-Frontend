import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Car, Coffee, Utensils, PawPrint } from "lucide-react";
import React from "react";

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
  const handleHotelTypeChange = (type: string, checked: boolean) => {
    if (checked) setHotelTypes([...hotelTypes, type]);
    else setHotelTypes(hotelTypes.filter((t) => t !== type));
  };
  const handleAmenityChange = (name: string, checked: boolean) => {
    if (checked) setAmenities([...amenities, name]);
    else setAmenities(amenities.filter((a) => a !== name));
  };
  return (
    <div className="lg:w-80">
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6">Filters</h2>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar; 