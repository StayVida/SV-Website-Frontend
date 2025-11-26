import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import {
  eventTypeOptions,
  type EventPackage,
} from "./types";
import { MultiSelectField } from "./MultiSelectField";

interface EventDetailsFormProps {
  eventPackages: EventPackage[];
  addEventPackage: () => void;
  removeEventPackage: (id: string) => void;
  updateEventPackageField: (id: string, field: "eventType" | "amount" | "guestCount", value: string) => void;
  updateEventPackageAmenities: (id: string, amenities: string[]) => void;
  amenitiesOptions: string[];
}

export const EventDetailsForm = ({
  eventPackages,
  addEventPackage,
  removeEventPackage,
  updateEventPackageField,
  updateEventPackageAmenities,
  amenitiesOptions,
}: EventDetailsFormProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-6 space-y-6">
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
                options={amenitiesOptions}
                selected={pkg.amenities}
                onChange={(values) => updateEventPackageAmenities(pkg.id, values)}
                className="mt-4"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
