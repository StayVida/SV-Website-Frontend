import apiClient from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { normalizeImages } from '@/utils/imageUtils';

export interface Rating {
    rating_ID: number;
    user_ID: number;
    hotel_ID: string;
    booking_ID: string;
    rating_Value: number;
    comment: string;
    rated_at: string;
    user_Name: string;
}

export interface HotelRatingsResponse {
    ratings: Rating[];
    averageRating: number;
}

/**
 * Fetch ratings for a specific hotel or all ratings if no hotelId is provided
 */
export const getHotelRatings = async (hotelId?: string): Promise<HotelRatingsResponse> => {
    const url = hotelId ? `${API_ENDPOINTS.HOTEL_REVIEWS}?hotel_ID=${hotelId}` : API_ENDPOINTS.HOTEL_REVIEWS;
    const response = await apiClient.get(url);
    return response.data;
};

export interface LocationData {
    location: string;
    lowestPrice: number | null;
    hotelCount: number;
    images: string[];
}

/**
 * Fetch the list of locations from the server
 */
export const getLocations = async (): Promise<LocationData[]> => {
  try {
    const response = await apiClient.get<any>(API_ENDPOINTS.LOCATIONS_LIST);
    let data = response.data;

    // Handle case where API returns a string instead of an object/array
    if (typeof data === "string" && data.trim().startsWith("[")) {
      try {
        data = JSON.parse(data);
        console.log("getLocations: Successfully parsed stringified response");
      } catch (e) {
        console.error("getLocations: Failed to parse stringified response:", e);
      }
    }

    // Ensure data is an array, potentially extracting from a 'data' property if present
    let processedData: any[] = [];
    if (Array.isArray(data)) {
      processedData = data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      processedData = data.data;
    } else {
      console.warn("getLocations: API response is not an array or does not contain a 'data' array property:", data);
      return [];
    }

    return processedData.map((item: any) => ({
      ...item,
      images: normalizeImages(item.images)
    }));
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return [];
  }
};

export interface CreateRatingRequest {
    booking_id: string;
    hotel_id: string;
    rating_value: number;
    comment: string;
}


/**
 * Create a new rating/review for a hotel stay
 */
export const createRating = async (data: CreateRatingRequest): Promise<any> => {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_RATING, data);
    return response.data;
};
