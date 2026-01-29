import apiClient from './axios';
import { API_ENDPOINTS } from '@/config/api';
import { normalizeImages } from '@/utils/imageUtils';

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
    const response = await apiClient.get(API_ENDPOINTS.LOCATIONS_LIST);

    // Normalize data and images
    const rawData = Array.isArray(response.data) ? response.data :
        (response.data?.data && Array.isArray(response.data.data)) ? response.data.data : [];

    return rawData.map((item: any) => ({
        ...item,
        images: normalizeImages(item.images)
    }));
};
