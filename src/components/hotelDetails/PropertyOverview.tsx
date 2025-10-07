import type { Hotel } from "@/types/hotelType";

interface PropertyOverviewProps {
  hotel: Hotel;
}

export default function PropertyOverview({ hotel }: PropertyOverviewProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Property Overview
      </h2>
      <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
    </div>
  );
}
