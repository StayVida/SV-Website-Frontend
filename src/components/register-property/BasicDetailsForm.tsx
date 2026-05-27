import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Upload, X, Check } from "lucide-react";
import { useState } from "react";
import { validatePromoCode } from "@/api/booking";
import {
  propertyTypes,
  type ImagePreview,
} from "./types";
import { MultiSelectField } from "./MultiSelectField";
import { LocationPicker } from "./LocationPicker";

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "US/Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
];

interface BasicDetailsFormProps {
  name: string;
  setName: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  images: ImagePreview[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
  latitude: number;
  setLatitude: (value: number) => void;
  longitude: number;
  setLongitude: (value: number) => void;
  handleUseCurrentLocation: () => void;
  provideEvents: boolean;
  handleProvideEventsToggle: () => void;
  referralCode: string;
  setReferralCode: (value: string) => void;
  isReferralValid: boolean | null;
  setIsReferralValid: (value: boolean | null) => void;
  errors?: Record<string, string>;
}

import { useTags, useAmenities, useLocations } from "@/hooks/useLookups";

export const BasicDetailsForm = ({
  name,
  setName,
  type,
  setType,
  destination,
  setDestination,
  description,
  setDescription,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  images,
  handleImageUpload,
  removeImage,
  selectedTags,
  setSelectedTags,
  selectedAmenities,
  setSelectedAmenities,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  handleUseCurrentLocation,
  provideEvents,
  handleProvideEventsToggle,
  referralCode,
  setReferralCode,
  isReferralValid,
  setIsReferralValid,
  errors,
}: BasicDetailsFormProps) => {
  const { data: tagsOptions = [] } = useTags();
  const { data: amenitiesOptions = [] } = useAmenities();
  const { data: locationsData = [] } = useLocations();

  const [showReferralInput, setShowReferralInput] = useState(!!referralCode);
  const [isValidating, setIsValidating] = useState(false);

  const handleVerifyReferral = async () => {
    if (!referralCode.trim()) return;
    setIsValidating(true);
    setIsReferralValid(null);
    try {
      const isValid = await validatePromoCode(referralCode.trim());
      setIsReferralValid(isValid);
    } catch (error) {
      console.error("Error validating referral code:", error);
      setIsReferralValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const destinationOptions = Array.from(new Set(locationsData.map((l: any) => l.location)));

  return (
    <>
      <Card className="border-none shadow-lg">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Property Images *</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Upload high-quality images (PNG/JPG, less than 50MB, up to 1080p)
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
          {errors?.images && (
            <p className="text-xs text-red-500 font-medium mt-2 text-center">{errors.images}</p>
          )}
          {images?.length > 0 && (
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
                className={`mt-2 h-12 ${errors?.name ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
              />
              {errors?.name && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="property-type" className="text-sm text-gray-700 font-medium">
                Property Type *
              </Label>
              <select
                id="property-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
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
                list="destinations-list"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Mumbai"
                required
                className={`mt-2 h-12 ${errors?.destination ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
              />
              {errors?.destination && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.destination}</p>
              )}
              <datalist id="destinations-list">
                {destinationOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
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
                className={`mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${errors?.description ? "border-red-500 focus:ring-red-500/20" : "border-gray-300"}`}
              />
              {errors?.description && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.description}</p>
              )}
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
              <select
                id="country-code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                required
                className="mt-2 h-12 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                <option value="" disabled>Select...</option>
                {countryCodes.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
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
                className={`mt-2 h-12 ${errors?.phoneNumber ? "border-red-500 focus-visible:ring-red-500/20" : ""}`}
              />
              {errors?.phoneNumber && (
                <p className="text-xs text-red-500 font-medium mt-1">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            {!showReferralInput ? (
              <button
                type="button"
                onClick={() => setShowReferralInput(true)}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer"
              >
                <span>+ Have a referral code?</span>
              </button>
            ) : (
              <div className="space-y-3 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <Label htmlFor="referral-code" className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                    Referral Code
                    <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReferralInput(false);
                      setReferralCode("");
                      setIsReferralValid(null);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium bg-transparent border-none p-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      id="referral-code"
                      value={referralCode}
                      onChange={(e) => {
                        setReferralCode(e.target.value);
                        setIsReferralValid(null);
                      }}
                      placeholder="e.g. STAYVIDA123"
                      className={`h-12 pr-10 transition-colors ${
                        isReferralValid === true
                          ? "border-green-500 focus-visible:ring-green-500/20"
                          : isReferralValid === false
                          ? "border-red-500 focus-visible:ring-red-500/20"
                          : ""
                      }`}
                      disabled={isValidating}
                    />
                    {isReferralValid === true && (
                      <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    )}
                    {isReferralValid === false && (
                      <X className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyReferral}
                    disabled={isValidating || !referralCode.trim() || isReferralValid === true}
                    className="h-12 px-6"
                  >
                    {isValidating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifying
                      </span>
                    ) : isReferralValid === true ? (
                      "Verified"
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                {isReferralValid === true && (
                  <p className="text-sm text-green-600 font-medium flex items-center gap-1.5 animate-fadeIn">
                    Referral code applied successfully!
                  </p>
                )}
                {isReferralValid === false && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1.5 animate-fadeIn">
                    Invalid referral code. Please enter a valid code or clear it.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Tags & Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiSelectField
              label="Tags *"
              placeholder="Select tags"
              options={tagsOptions}
              selected={selectedTags}
              onChange={setSelectedTags}
            />
            <MultiSelectField
              label="Amenities *"
              placeholder="Select amenities"
              options={amenitiesOptions}
              selected={selectedAmenities}
              onChange={setSelectedAmenities}
            />
          </div>
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
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              Click anywhere on the map to drop a pin and set the location.
            </div>
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
              className={`w-16 h-8 rounded-full px-1 transition ${provideEvents ? "bg-primary" : "bg-gray-300"
                }`}
              aria-pressed={provideEvents}
            >
              <span
                className={`block h-6 w-6 bg-white rounded-full shadow transform transition ${provideEvents ? "translate-x-8" : ""
                  }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
