export interface Room {
    type: string;
    price: number;
    available: number;
  // INSERT_YOUR_REWRITE_HERE
  }
  
  export interface Hotel {
    id: number;
    name: string;
    type: "Hotel" | "Resort" | "Villa" | "Guest House";
    location: string;
    rating: number;             // e.g., 4.5 out of 5
    pricePerNight: number;      // starting price
    amenities: string[];        // e.g., ["WiFi", "Pool"]
    images: string[];           // URLs to images
    description: string;
    rooms: Room[];
  }
  