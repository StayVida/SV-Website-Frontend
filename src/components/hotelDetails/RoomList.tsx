import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/hotelType";

interface RoomListProps {
  hotel: Hotel;
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
}

const RoomImageSlider = ({ images, name }: { images: string[], name: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <img
        src="/placeholder.svg"
        alt={name}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img || "/placeholder.svg"}
          alt={`${name} ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function RoomList({ hotel, selectedRoom, onRoomSelect }: RoomListProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        Available Rooms
      </h2>
      <div className="space-y-4 sm:space-y-6">
        {hotel.rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-64 h-56 sm:h-auto min-h-[200px] flex-shrink-0">
                  <RoomImageSlider images={room.images} name={room.name} />
                </div>
                <div className="flex-1 p-4 sm:p-6 flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{room.name}</h3>
                    {selectedRoom === room.id && (
                      <Badge className="bg-gray-900 text-white self-start">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="text-xs px-2 py-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mt-auto pt-4">
                    <div className="flex items-baseline">
                      <span className="text-xl sm:text-2xl font-bold text-green-600">
                        ₹{room.price.toLocaleString()}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600 ml-1">/night</span>
                    </div>
                    {selectedRoom === room.id ? (
                      <Button 
                        disabled 
                        className="bg-gray-900 text-white w-full sm:w-auto px-6 py-2"
                      >
                        Selected
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onRoomSelect(room.id)}
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-6 py-2"
                      >
                        Select Room
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
