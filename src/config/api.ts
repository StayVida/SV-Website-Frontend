// API Configuration
// Set VITE_API_BASE_URI in your .env file (e.g., VITE_API_BASE_URI=http://localhost:3000/api)
export const API_BASE_URI = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

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
  CREATE_BOOKING: "/api/bookings/book",
};

