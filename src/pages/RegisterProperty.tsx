import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import apiClient from "@/api/axios";
import {
  propertyTypes,
  type ImagePreview,
  type EventPackage,
  type RoomForm,
} from "@/components/register-property/types";
import { BasicDetailsForm } from "@/components/register-property/BasicDetailsForm";
import { EventDetailsForm } from "@/components/register-property/EventDetailsForm";
import { RoomDetailsForm } from "@/components/register-property/RoomDetailsForm";
import { API_ENDPOINTS, DASHBOARD_URL } from "@/config/api";
import { toast } from "sonner";
import {
  useRegisterHotel,
  useAddEventPackage,
  useRegisterRoom
} from "@/hooks/useLookups";
import usePageSEO from "@/hooks/usePageSEO";

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
  roomNumber: "",
});


const createEventPackage = (): EventPackage => ({
  id: generateId(),
  eventType: "",
  amount: "",
  guestCount: "",
  amenities: [],
});

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

const validateImage = (file: File): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    if (file.size > MAX_FILE_SIZE) {
      resolve({ valid: false, error: `Image ${file.name} exceeds 50MB limit.` });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const isLandscape = img.width >= img.height;
      const isValid = isLandscape
        ? img.width <= MAX_WIDTH && img.height <= MAX_HEIGHT
        : img.height <= MAX_WIDTH && img.width <= MAX_HEIGHT;

      if (!isValid) {
        resolve({
          valid: false,
          error: `Image ${file.name} exceeds 1080p resolution (${img.width}x${img.height}).`,
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: `Failed to load image ${file.name}.` });
    };

    img.src = url;
  });
};

const RegisterProperty = () => {
  usePageSEO({
    title: "Register Your Property",
    description: "List your hotel or event venue on StayVida. Reach thousands of travellers and event planners across India.",
    keywords: "register hotel, list property, hotel owner StayVida",
  });
  const [currentStep, setCurrentStep] = useState(1);
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


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const validPreviews: ImagePreview[] = [];
    for (const file of files) {
      const validation = await validateImage(file);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }

      const url = URL.createObjectURL(file);
      const id = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
      validPreviews.push({ id, url, name: file.name, file });
    }

    if (validPreviews.length > 0) {
      setImages((prev) => [...prev, ...validPreviews]);
    }
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

  const handleRoomImageUpload = async (roomId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const validPreviews: ImagePreview[] = [];
    for (const file of files) {
      const validation = await validateImage(file);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }

      validPreviews.push({
        id: `${roomId}-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        file,
      });
    }

    if (validPreviews.length > 0) {
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id !== roomId) return room;
          return { ...room, images: [...room.images, ...validPreviews] };
        })
      );
    }
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

  const registerRoomMutation = useRegisterRoom();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const hotelId = localStorage.getItem("hotelId");
      if (!hotelId) {
        alert("Hotel ID not found. Please complete Step 1 first.");
        setIsSubmitting(false);
        return;
      }

      const roomPromises = rooms.map(async (room) => {
        const formData = new FormData();
        formData.append("hotelId", hotelId);
        formData.append("roomType", room.roomType);
        formData.append("features", JSON.stringify(room.features));
        formData.append("maxAdults", room.maxAdults || "0");
        formData.append("maxChildren", room.maxChildren || "0");
        formData.append("bedCount", room.bedCount || "0");
        formData.append("price", room.price || "0");
        formData.append("roomNumber", room.roomNumber || "0");

        room.images.forEach((image) => {
          if (image.file) {
            formData.append("images", image.file);
          }
        });

        return registerRoomMutation.mutateAsync(formData);
      });

      await Promise.all(roomPromises);
      window.location.href = DASHBOARD_URL;
    } catch (error) {
      console.error("Error registering rooms:", error);
      alert("Failed to register rooms. Please try again.");
      setIsSubmitting(false);
    }
  };

  const hasValidRooms = rooms.every((room) => room.roomType.trim() && room.price.trim());

  const hasEventDetails =
    !provideEvents ||
    (eventPackages.length > 0 &&
      eventPackages.every(
        (pkg) => pkg.eventType.trim() && pkg.amount.trim() && pkg.guestCount.trim()
      ));

  const isStep1Valid =
    name &&
    destination &&
    description &&
    countryCode &&
    phoneNumber &&
    images.length > 0;

  const isStep2Valid = hasEventDetails;
  const isStep3Valid = hasValidRooms;

  const registerHotelMutation = useRegisterHotel();
  const addEventPackageMutation = useAddEventPackage();

  const handleNext = async () => {
    if (currentStep === 1 && isStep1Valid) {
      try {
        setIsSubmitting(true);

        const formData = new FormData();
        let ownerId;
        try {
          const authData = localStorage.getItem("authData");
          if (authData) {
            const parsedAuthData = JSON.parse(authData);
            ownerId = parsedAuthData?.user?.userID;
          }
        } catch (error) {
          console.error("Error parsing authData:", error);
        }

        const data = {
          owner_ID: ownerId,
          name,
          type,
          destination,
          isForEvent: provideEvents,
          description,
          phone_NO: phoneNumber,
          country_code: countryCode,
          tags: selectedTags,
          amenities: selectedAmenities,
          longitude: longitude.toString(),
          latitude: latitude.toString(),
        };

        formData.append("data", JSON.stringify(data));
        images.forEach((image) => {
          if (image.file) {
            formData.append("image", image.file);
          }
        });

        const response = await registerHotelMutation.mutateAsync(formData);

        if (response?.data?.hotelId) {
          localStorage.setItem("hotelId", response.data.hotelId.toString());
        }

        if (provideEvents) {
          setCurrentStep(2);
        } else {
          setCurrentStep(3);
        }
      } catch (error) {
        console.error("Error registering hotel:", error);
        alert("Failed to register hotel. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 2 && isStep2Valid) {
      try {
        setIsSubmitting(true);
        const hotelId = localStorage.getItem("hotelId");
        if (!hotelId) {
          alert("Hotel ID not found. Please complete Step 1 first.");
          return;
        }

        const savePromises = eventPackages.map((pkg) => {
          const eventData = {
            eventType: pkg.eventType,
            amount: Number(pkg.amount) || 0,
            hotel_ID: Number(hotelId),
            guestCount: Number(pkg.guestCount) || 0,
            amenities: pkg.amenities,
          };
          return addEventPackageMutation.mutateAsync(eventData);
        });

        await Promise.all(savePromises);
        setCurrentStep(3);
      } catch (error) {
        console.error("Error saving event details:", error);
        alert("Failed to save event details. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      if (provideEvents) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

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

        {/* Stepper */}
        {/* <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    currentStep >= step
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 text-gray-500"
                  )}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-12 transition-colors",
                      currentStep > step ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && (
            <BasicDetailsForm
              name={name}
              setName={setName}
              type={type}
              setType={setType}
              destination={destination}
              setDestination={setDestination}
              description={description}
              setDescription={setDescription}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              images={images}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              latitude={latitude}
              setLatitude={setLatitude}
              longitude={longitude}
              setLongitude={setLongitude}
              handleUseCurrentLocation={handleUseCurrentLocation}

              provideEvents={provideEvents}
              handleProvideEventsToggle={handleProvideEventsToggle}
            />
          )}

          {currentStep === 2 && provideEvents && (
            <EventDetailsForm
              eventPackages={eventPackages}
              addEventPackage={addEventPackage}
              removeEventPackage={removeEventPackage}
              updateEventPackageField={updateEventPackageField}
              updateEventPackageAmenities={updateEventPackageAmenities}
            />
          )}

          {currentStep === 3 && (
            <RoomDetailsForm
              rooms={rooms}
              addRoom={addRoom}
              removeRoom={removeRoom}
              updateRoomField={updateRoomField}
              updateRoomFeatures={updateRoomFeatures}
              handleRoomImageUpload={handleRoomImageUpload}
              removeRoomImage={removeRoomImage}
              provideEvents={provideEvents}
            />
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn("px-8 py-3", currentStep === 1 && "invisible")}
            >
              Back
            </Button>

            <div className="flex gap-3">
              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);

                      // Get hotelId from localStorage
                      const hotelId = localStorage.getItem("hotelId");

                      if (!hotelId) {
                        alert("Hotel ID not found. Please complete Step 1 first.");
                        return;
                      }

                      // Save each event package
                      const savePromises = eventPackages.map((pkg) => {
                        const eventData = {
                          eventType: pkg.eventType,
                          amount: Number(pkg.amount) || 0,
                          hotel_ID: Number(hotelId),
                          guestCount: Number(pkg.guestCount) || 0,
                          amenities: pkg.amenities,
                        };
                        return apiClient.post("/api/events/add", eventData);
                      });

                      await Promise.all(savePromises);

                      // Navigate to Room Details
                      setCurrentStep(3);
                    } catch (error) {
                      console.error("Error saving event details:", error);
                      alert("Failed to save event details. Please try again.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting || eventPackages.length === 0}
                  className="px-8 py-3"
                >
                  {isSubmitting ? "Saving..." : "Add Rooms"}
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid) ||
                    isSubmitting
                  }
                  className="px-8 py-3"
                >
                  {isSubmitting ? "Saving..." : "Next"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStep3Valid || isSubmitting}
                  className="px-8 py-3"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProperty;
