export type Amenity = {
  name: string;
  icon: string;
};

export interface Room {
  id: string;
  name: string;
  images: string[];
  features: string[];
  price: number;
  platformCharges?: number;
  taxRate?: number;
  available: number;
  stayDuration: number;
  totalAmount?: number;
  advanceAmount?: number;
}

export interface Hotel {
  id: string;
  name: string;
  type: "Resort" | "Hotel" | "Villa" | "Guest House";
  destination: string;
  rating: number;
  onArrivalPayment: boolean;
  pricePerNight: number;
  tags: string[];
  amenities: Amenity[];
  images: string[];
  description: string;
  rooms: Room[];
}
