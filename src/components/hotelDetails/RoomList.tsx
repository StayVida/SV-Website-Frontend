import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/hotelType";

interface RoomListProps {
  hotel: Hotel;
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
}

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
                <div className="relative w-full sm:w-48 h-48 sm:h-32">
                  <img
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 sm:p-6">
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
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
              <div className="px-4 pb-4 sm:px-6">
                <div className="flex space-x-2 overflow-x-auto">
                  {room.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-12 sm:w-16 sm:h-12 rounded overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${room.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
