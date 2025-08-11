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
  available: number;
}

export interface Hotel {
  id: number;
  name: string;
  type: "Resort" | "Hotel" | "Villa" | "Guest House";
  destination: string;
  rating: number;
  pricePerNight: number;
  tags: string[];
  amenities: Amenity[];
  images: string[];
  description: string;
  rooms: Room[];
}
  