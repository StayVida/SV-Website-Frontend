import apiClient from './axios';
import { API_ENDPOINTS } from '@/config/api';
import type { Amenity, Tag, Feature } from '@/components/register-property/types';

export const getAmenities = async (): Promise<string[]> => {
    const response = await apiClient.get<Amenity[]>(API_ENDPOINTS.LOOKUP_AMENITIES);
    return (response.data || [])
        .filter((item) => item.status === "enable")
        .map((item) => item.name);
};

export const getTags = async (): Promise<string[]> => {
    const response = await apiClient.get<Tag[]>(API_ENDPOINTS.LOOKUP_TAGS);
    return (response.data || [])
        .filter((item) => item.status === "enable")
        .map((item) => item.name);
};

export const getFeatures = async (): Promise<string[]> => {
    const response = await apiClient.get<Feature[]>(API_ENDPOINTS.LOOKUP_FEATURES);
    if (!response.data) return [];

    const features = response.data
        .filter((item) => item.status === "enable")
        .flatMap((item) => item.name.split(","));

    return Array.from(new Set(features));
};
