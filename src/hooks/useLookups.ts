import { useQuery, useMutation } from '@tanstack/react-query';
import { getAmenities, getTags, getFeatures } from '@/api/lookup';
import { getLocations } from '@/api/hotelsApi';
import apiClient from '@/api/axios';

export const useAmenities = () => {
    return useQuery({
        queryKey: ['amenities'],
        queryFn: getAmenities,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useTags = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useFeatures = () => {
    return useQuery({
        queryKey: ['features'],
        queryFn: getFeatures,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: getLocations,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useRegisterHotel = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post("/api/hotels/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        }
    });
};

export const useAddEventPackage = () => {
    return useMutation({
        mutationFn: async (eventData: any) => {
            const response = await apiClient.post("/api/events/add", eventData);
            return response.data;
        }
    });
};

export const useRegisterRoom = () => {
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await apiClient.post("/api/hotels/register_room_with_images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        }
    });
};
