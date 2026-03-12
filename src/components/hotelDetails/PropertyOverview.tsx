import type { Hotel } from "@/types/hotelType";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PropertyOverviewProps {
  hotel: Hotel;
}

export default function PropertyOverview({ hotel }: PropertyOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = hotel.description || "";
  const words = description.split(/\s+/);
  const isLongDescription = words.length > 200;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const displayedDescription = isLongDescription && !isExpanded
    ? words.slice(0, 200).join(" ") + "..."
    : description;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Property Overview
      </h2>
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {displayedDescription}
        </p>
        {isLongDescription && (
          <Button
            variant="link"
            onClick={toggleExpand}
            className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </div>
    </div>
  );
}
