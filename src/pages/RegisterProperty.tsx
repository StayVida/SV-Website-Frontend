import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, X, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreview {
  id: string;
  url: string;
  name: string;
}

const propertyTypes = ["Hotel", "Resort", "Villa", "Guest House", "Apartment"];

const tagsOptions = [
  "Beachfront",
  "Business Friendly",
  "Budget",
  "Luxury",
  "Family Friendly",
  "Romantic",
];

const amenitiesOptions = [
  "Free WiFi",
  "Pool",
  "Gym",
  "Spa",
  "Parking",
  "Airport Shuttle",
  "Restaurant",
  "Bar",
];

const roomFeatureOptions = [
  "WiFi",
  "Balcony",
  "Air Conditioning",
  "Smart TV",
  "Mini Bar",
  "Workspace",
  "Kitchenette",
];

const eventTypeOptions = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Conference",
  "Engagement",
  "Baby Shower",
];

const eventAmenitiesOptions = [
  "Stage Setup",
  "Catering",
  "Decor",
  "Sound System",
  "Lighting",
  "Photography",
];

interface EventPackage {
  id: string;
  eventType: string;
  amount: string;
  guestCount: string;
  amenities: string[];
}

interface RoomForm {
  id: string;
  roomType: string;
  features: string[];
  maxAdults: string;
  maxChildren: string;
  bedCount: string;
  price: string;
  images: ImagePreview[];
}

const generateId = () => Math.random().toString(36).slice(2, 11);

const createRoom = (): RoomForm => ({
  id: generateId(),
  roomType: "",
  features: [],
  maxAdults: "",
  maxChildren: "",
  bedCount: "",
  price: "",
  images: [],
});

const createEventPackage = (): EventPackage => ({
  id: generateId(),
  eventType: "",
  amount: "",
  guestCount: "",
  amenities: [],
});

interface MultiSelectFieldProps {
  label?: string;
  placeholder?: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
  allowSearch?: boolean;
}

const MultiSelectField = ({
  label,
  placeholder = "Select options",
  options,
  selected,
  onChange,
  className,
  allowSearch = true,
}: MultiSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [options, searchTerm]);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div ref={containerRef} className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm text-gray-700 font-medium" htmlFor={label}>
          {label}
        </Label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium shadow-sm transition hover:border-gray-400",
            selected.length === 0 ? "text-gray-500" : "text-gray-900"
          )}
        >
          <span>{selected.length === 0 ? placeholder : `${selected.length} selected`}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform",
              open ? "rotate-180" : ""
            )}
          />
        </button>
        {open && (
          <div className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {allowSearch && options.length > 6 && (
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="rounded-lg border border-gray-200 px-3 py-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto py-2">
              {filteredOptions.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">No options found</p>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() => toggleValue(option)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => (
            <span
              key={value}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {value}
              <button
                type="button"
                onClick={() => toggleValue(value)}
                className="text-primary hover:text-primary/70"
                aria-label={`Remove ${value}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const RegisterProperty = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState(propertyTypes[0]);
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [latitude, setLatitude] = useState(19.076);
  const [longitude, setLongitude] = useState(72.8777);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provideEvents, setProvideEvents] = useState(false);
  const [eventPackages, setEventPackages] = useState<EventPackage[]>([]);
  const [rooms, setRooms] = useState<RoomForm[]>([createRoom()]);

  const propertyImagesRef = useRef<ImagePreview[]>([]);
  const roomImagesRef = useRef<RoomForm[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const previews = files.map((file) => {
      const url = URL.createObjectURL(file);
      const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
      return { id, url, name: file.name };
    });

    setImages((prev) => [...prev, ...previews]);
    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => {
        // silently fail
      }
    );
  };

  const mapSrc = useMemo(
    () => `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`,
    [latitude, longitude]
  );

  const handleProvideEventsToggle = () => {
    setProvideEvents((prev) => {
      const next = !prev;
      if (!next) {
        setEventPackages([]);
      } else if (eventPackages.length === 0) {
        setEventPackages([createEventPackage()]);
      }
      return next;
    });
  };

  const addEventPackage = () => {
    setEventPackages((prev) => [...prev, createEventPackage()]);
  };

  const removeEventPackage = (packageId: string) => {
    setEventPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
  };

  const updateEventPackageField = (
    packageId: string,
    field: "eventType" | "amount" | "guestCount",
    value: string
  ) => {
    setEventPackages((prev) =>
      prev.map((pkg) => (pkg.id === packageId ? { ...pkg, [field]: value } : pkg))
    );
  };

  const updateEventPackageAmenities = (packageId: string, amenities: string[]) => {
    setEventPackages((prev) =>
      prev.map((pkg) => (pkg.id === packageId ? { ...pkg, amenities } : pkg))
    );
  };

  const addRoom = () => setRooms((prev) => [...prev, createRoom()]);

  const removeRoom = (roomId: string) => {
    if (rooms.length === 1) return;
    setRooms((prev) => {
      const roomToRemove = prev.find((room) => room.id === roomId);
      roomToRemove?.images.forEach((img) => URL.revokeObjectURL(img.url));
      return prev.filter((room) => room.id !== roomId);
    });
  };

  const updateRoomField = (roomId: string, field: keyof RoomForm, value: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              [field]: value,
            }
          : room
      )
    );
  };

  const updateRoomFeatures = (roomId: string, features: string[]) => {
    setRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, features } : room))
    );
  };

  const handleRoomImageUpload = (roomId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const previews = files.map((file) => ({
          id: `${roomId}-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          url: URL.createObjectURL(file),
          name: file.name,
        }));
        return { ...room, images: [...room.images, ...previews] };
      })
    );
    event.target.value = "";
  };

  const removeRoomImage = (roomId: string, imageId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const imageToRemove = room.images.find((img) => img.id === imageId);
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.url);
        }
        return { ...room, images: room.images.filter((img) => img.id !== imageId) };
      })
    );
  };

  useEffect(() => {
    propertyImagesRef.current = images;
  }, [images]);

  useEffect(() => {
    roomImagesRef.current = rooms;
  }, [rooms]);

  useEffect(() => {
    return () => {
      propertyImagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
      roomImagesRef.current.forEach((room) =>
        room.images.forEach((img) => URL.revokeObjectURL(img.url))
      );
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      type,
      destination,
      description,
      countryCode,
      phoneNumber,
      latitude,
      longitude,
      provideEvents,
      tags: selectedTags,
      amenities: selectedAmenities,
      images: images.map((img) => img.name),
      events: provideEvents
        ? eventPackages.map((pkg) => ({
            eventType: pkg.eventType,
            amount: Number(pkg.amount) || 0,
            guestCount: Number(pkg.guestCount) || 0,
            amenities: pkg.amenities,
          }))
        : [],
      rooms: rooms.map((room) => ({
        roomType: room.roomType,
        features: room.features,
        maxAdults: Number(room.maxAdults) || 0,
        maxChildren: Number(room.maxChildren) || 0,
        bedCount: Number(room.bedCount) || 0,
        price: Number(room.price) || 0,
        images: room.images.map((img) => img.name),
      })),
    };

    console.log("Register property payload:", payload);
    setTimeout(() => setIsSubmitting(false), 800);
  };

  const hasValidRooms = rooms.every((room) => room.roomType.trim() && room.price.trim());

  const hasEventDetails =
    !provideEvents ||
    (eventPackages.length > 0 &&
      eventPackages.every(
        (pkg) => pkg.eventType.trim() && pkg.amount.trim() && pkg.guestCount.trim()
      ));

  const isSubmitDisabled =
    !name ||
    !destination ||
    !description ||
    !phoneNumber ||
    images.length === 0 ||
    !hasValidRooms ||
    !hasEventDetails;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Register Your Property
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Provide detailed information so travelers can discover and book your property with
            confidence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="property-name" className="text-sm text-gray-700 font-medium">
                    Property Name *
                  </Label>
                  <Input
                    id="property-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Seaside Retreat"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="property-type" className="text-sm text-gray-700 font-medium">
                    Property Type *
                  </Label>
                  <select
                    id="property-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-2 h-12 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    {propertyTypes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="destination" className="text-sm text-gray-700 font-medium">
                    Destination / City *
                  </Label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Mumbai"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm text-gray-700 font-medium">
                    Description *
                  </Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Highlight what makes your property unique..."
                    rows={4}
                    required
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="country-code" className="text-sm text-gray-700 font-medium">
                    Country Code *
                  </Label>
                  <Input
                    id="country-code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone-number" className="text-sm text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter a reachable phone number"
                    required
                    className="mt-2 h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Tags & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiSelectField
                  label="Tags"
                  placeholder="Select tags"
                  options={tagsOptions}
                  selected={selectedTags}
                  onChange={setSelectedTags}
                />
                <MultiSelectField
                  label="Amenities"
                  placeholder="Select amenities"
                  options={amenitiesOptions}
                  selected={selectedAmenities}
                  onChange={setSelectedAmenities}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Do you host events?</h2>
                  <p className="text-sm text-gray-600">
                    Toggle to capture event-specific offerings and pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProvideEventsToggle}
                  className={`w-16 h-8 rounded-full px-1 transition ${
                    provideEvents ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-pressed={provideEvents}
                >
                  <span
                    className={`block h-6 w-6 bg-white rounded-full shadow transform transition ${
                      provideEvents ? "translate-x-8" : ""
                    }`}
                  />
                </button>
              </div>

              {provideEvents && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Event Packages</h3>
                      <p className="text-sm text-gray-600">
                        Add detailed offerings for each event type you support.
                      </p>
                    </div>
                    <Button type="button" variant="outline" onClick={addEventPackage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>

                  {eventPackages.length === 0 && (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
                      Add at least one event package to continue.
                    </p>
                  )}

                  <div className="space-y-5">
                    {eventPackages.map((pkg, index) => (
                      <div
                        key={pkg.id}
                        className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Event #{index + 1}
                          </h4>
                          {eventPackages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEventPackage(pkg.id)}
                              className="text-sm text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label className="text-sm text-gray-700 font-medium">Event Type *</Label>
                            <Select
                              value={pkg.eventType}
                              onValueChange={(value) =>
                                updateEventPackageField(pkg.id, "eventType", value)
                              }
                            >
                              <SelectTrigger className="mt-2 h-12 w-full rounded-xl border border-gray-300">
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                              <SelectContent>
                                {eventTypeOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-700 font-medium">
                              Starting Amount (₹) *
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={pkg.amount}
                              onChange={(e) =>
                                updateEventPackageField(pkg.id, "amount", e.target.value)
                              }
                              placeholder="e.g. 150000"
                              className="mt-2 h-12"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-700 font-medium">
                              Guest Capacity *
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={pkg.guestCount}
                              onChange={(e) =>
                                updateEventPackageField(pkg.id, "guestCount", e.target.value)
                              }
                              placeholder="e.g. 250"
                              className="mt-2 h-12"
                            />
                          </div>
                        </div>
                        <MultiSelectField
                          label="Event Amenities"
                          placeholder="Select amenities"
                          options={eventAmenitiesOptions}
                          selected={pkg.amenities}
                          onChange={(values) => updateEventPackageAmenities(pkg.id, values)}
                          className="mt-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Location</h2>
                <Button variant="outline" type="button" onClick={handleUseCurrentLocation}>
                  Use Current Location
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="latitude" className="text-sm text-gray-700 font-medium">
                    Latitude *
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-sm text-gray-700 font-medium">
                    Longitude *
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    required
                    className="mt-2 h-12"
                  />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <iframe
                  title="Selected location"
                  src={mapSrc}
                  className="w-full h-72 border-0"
                  loading="lazy"
                />
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Click “Use Current Location” or adjust the latitude/longitude values manually to
                  update the map preview.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Property Images</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  Upload high-quality images to showcase your property (PNG or JPG)
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/90 transition">
                  Choose Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="h-40 w-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
                      <h3 className="text-lg font-semibold text-gray-900">
                        Room #{index + 1}
                      </h3>
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
                        <Label className="text-sm text-gray-700 font-medium">Room Type *</Label>
                        <Input
                          value={room.roomType}
                          onChange={(e) => updateRoomField(room.id, "roomType", e.target.value)}
                          placeholder="e.g. Deluxe Suite"
                          required
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-700 font-medium">
                          Nightly Price (₹) *
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

                    <MultiSelectField
                      label="Features"
                      placeholder="Select room features"
                      options={roomFeatureOptions}
                      selected={room.features}
                      onChange={(values) => updateRoomFeatures(room.id, values)}
                    />

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

          <div className="flex justify-end">
            <Button type="submit" className="px-8 py-3" disabled={isSubmitting || isSubmitDisabled}>
              {isSubmitting ? "Submitting..." : "Submit Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProperty;

