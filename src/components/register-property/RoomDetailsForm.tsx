import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Plus } from "lucide-react";
import { type RoomForm } from "./types";
import { MultiSelectField } from "./MultiSelectField";

interface RoomDetailsFormProps {
  rooms: RoomForm[];
  addRoom: () => void;
  removeRoom: (id: string) => void;
  updateRoomField: (id: string, field: keyof RoomForm, value: string) => void;
  updateRoomFeatures: (id: string, features: string[]) => void;
  handleRoomImageUpload: (id: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  removeRoomImage: (roomId: string, imageId: string) => void;
  provideEvents: boolean;
}

import { useAmenities, useTags, useFeatures } from "@/hooks/useLookups";

export const RoomDetailsForm = ({
  rooms,
  addRoom,
  removeRoom,
  updateRoomField,
  updateRoomFeatures,
  handleRoomImageUpload,
  removeRoomImage,
  provideEvents,
}: RoomDetailsFormProps) => {
  const { data: featureOptions = [] } = useFeatures();
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Room Configurations</h2>
            <p className="text-sm text-gray-600">
              {provideEvents
                ? "Add stay options linked to your event packages."
                : "Detail the rooms available for travelers."}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addRoom}>
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </div>

        <div className="space-y-5">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Room #{index + 1}</h3>
                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Room Name *</Label>
                  <Input
                    value={room.roomType}
                    onChange={(e) => updateRoomField(room.id, "roomType", e.target.value)}
                    placeholder="e.g. Deluxe Suite"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Room Number *</Label>
                  <Input
                    value={room.roomNumber}
                    onChange={(e) => updateRoomField(room.id, "roomNumber", e.target.value)}
                    placeholder="e.g. 101"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 font-medium">
                    Nightly Price (₹)(With GST) *
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={room.price}
                    onChange={(e) => updateRoomField(room.id, "price", e.target.value)}
                    placeholder="e.g. 4500"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Max Adults</Label>
                  <Input
                    type="number"
                    min="0"
                    value={room.maxAdults}
                    onChange={(e) => updateRoomField(room.id, "maxAdults", e.target.value)}
                    placeholder="e.g. 2"
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Max Children</Label>
                  <Input
                    type="number"
                    min="0"
                    value={room.maxChildren}
                    onChange={(e) => updateRoomField(room.id, "maxChildren", e.target.value)}
                    placeholder="e.g. 1"
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 font-medium">Bed Count</Label>
                  <Input
                    type="number"
                    min="0"
                    value={room.bedCount}
                    onChange={(e) => updateRoomField(room.id, "bedCount", e.target.value)}
                    placeholder="e.g. 2"
                    className="mt-2 h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <MultiSelectField
                  label="Features"
                  placeholder="Select room features"
                  options={featureOptions}
                  selected={room.features}
                  onChange={(values) => updateRoomFeatures(room.id, values)}
                />
              </div>

              <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload room-specific images (PNG or JPG)
                </p>
                <label className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition">
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleRoomImageUpload(room.id, e)}
                  />
                </label>
                {room.images.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum one image required per room.
                  </p>
                )}
              </div>
              {room.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="h-32 w-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeRoomImage(room.id, image.id)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
