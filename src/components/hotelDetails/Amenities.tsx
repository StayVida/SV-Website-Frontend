import type { Hotel } from "@/types/hotelType";

interface AmenitiesProps {
  hotel: Hotel;
}

export default function Amenities({ hotel }: AmenitiesProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {hotel.amenities.map((amenity) => (
          <div
            key={amenity.name}
            className="bg-gray-50 p-4 rounded-lg text-center"
          >
            {amenity.icon && (
              <span className="w-6 h-6 text-green-600 mx-auto mb-2 text-2xl block" role="img" aria-label={amenity.name}>
                {amenity.icon}
              </span>
            )}
            <span className="text-sm font-medium text-gray-700">
              {amenity.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
