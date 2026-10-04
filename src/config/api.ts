// API Configuration
// Set NEXT_PUBLIC_API_BASE_URI in your .env file (e.g., NEXT_PUBLIC_API_BASE_URI=http://localhost:3000/api)
export const API_BASE_URI = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";
export const API_ROOT_URI = API_BASE_URI.replace(/\/api\/?$/, "");
export const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://hotel.stayvida.in/";

// API Endpoints
export const API_ENDPOINTS = {
  GET_OTP: "/otplogin/get-otp",
  VERIFY_OTP: "/otplogin/verify-otp",
  FEATURED_HOTELS: "/api/hotels/featurelist",
  HOTEL_DETAILS: "/api/hotels", // Will append /:hotelId/rooms
  SEARCH_HOTELS: "/api/hotels/search",
  SEARCH_EVENTS: "/api/events/search",
  HOTEL_REVIEWS: "/api/rating/hotel", // Will append /:hotelId
  LOCATIONS_LIST: "/api/locations/list",
  EVENTS_LIST: "/api/events/list",
  CONTACT_SUBMIT: "/api/contact/submit",
  CREATE_BOOKING: "/bookings/book", // Keep for backward compatibility if needed, or remove if replaced
  LOCK_ROOM: "/booking/lock-room",
  CONFIRM_BOOKING: "/booking/create",
  RAZORPAY_ORDER: "/payments/razorpay/order",
  RAZORPAY_VERIFY: "/payments/razorpay/verify",
  GET_BOOKING_DETAILS: "/profile/:bookingId/details",
  LOOKUP_AMENITIES: "/lookup/amenities",
  LOOKUP_FEATURES: "/lookup/features",
  LOOKUP_TAGS: "/lookup/tags",
  CREATE_RATING: "/rating/create",
};

