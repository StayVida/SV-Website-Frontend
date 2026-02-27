import apiClient from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { normalizeImages } from '@/utils/imageUtils';

export interface LocationData {
    location: string;
    lowestPrice: number | null;
    hotelCount: number;
    images: string[];
}


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
 * Fetch the list of locations from the server
 */
export const getLocations = async (): Promise<LocationData[]> => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATIONS_LIST);

    // Normalize data and images
    const rawData = Array.isArray(response.data) ? response.data :
        (response.data?.data && Array.isArray(response.data.data)) ? response.data.data : [];

    return rawData.map((item: any) => ({
        ...item,
        images: normalizeImages(item.images)
    }));
};

export interface CreateRatingRequest {
    booking_id: string;
    hotel_id: string;
    rating_value: number;
    comment: string;
}

/**
 * Fetch ratings for a specific hotel
 */
export const getHotelRatings = async (hotelId: string): Promise<HotelRatingsResponse> => {
    const response = await apiClient.get(`${API_ENDPOINTS.HOTEL_REVIEWS}?hotel_ID=${hotelId}`);
    return response.data;
};

/**
 * Create a new rating/review for a hotel stay
 */
export const createRating = async (data: CreateRatingRequest): Promise<any> => {
    const response = await apiClient.post(API_ENDPOINTS.CREATE_RATING, data);
    return response.data;
};
