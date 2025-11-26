export interface ImagePreview {
  id: string;
  url: string;
  name: string;
  file?: File;
}

export interface EventPackage {
  id: string;
  eventType: string;
  amount: string;
  guestCount: string;
  amenities: string[];
}

export interface RoomForm {
  id: string;
  roomType: string;
  features: string[];
  maxAdults: string;
  maxChildren: string;
  bedCount: string;
  price: string;
  images: ImagePreview[];
}

export interface Amenity {
  amenity_id: number;
  name: string;
  status: string;
}

export interface Tag {
  tag_id: number;
  name: string;
  status: string;
}

export interface Feature {
  feature_id: number;
  name: string;
  status: string;
}

export const propertyTypes = ["Hotel", "Resort", "Villa", "Guest House", "Apartment"];

export const eventTypeOptions = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Conference",
  "Engagement",
  "Baby Shower",
];
