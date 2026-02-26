// API Configuration
// Set VITE_API_BASE_URI in your .env file (e.g., VITE_API_BASE_URI=http://localhost:3000/api)
export const API_BASE_URI = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "https://sv-hotel-owner-dashboard.vercel.app/";

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
  CREATE_BOOKING: "/api/bookings/book", // Keep for backward compatibility if needed, or remove if replaced
  LOCK_ROOM: "/booking/lock-room",
  CONFIRM_BOOKING: "/booking/create",
  RAZORPAY_ORDER: "/api/payments/razorpay/order",
  RAZORPAY_VERIFY: "/api/payments/razorpay/verify",
  GET_BOOKING_DETAILS: "/api/profile/:bookingId/details",
  LOOKUP_AMENITIES: "/lookup/amenities",
  LOOKUP_FEATURES: "/lookup/features",
  LOOKUP_TAGS: "/lookup/tags",
};

