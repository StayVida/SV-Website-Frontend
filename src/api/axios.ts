import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import BaseUrl from '@/config/BaseUri';
import XApiKey from '@/config/XApiKey';

/**
 * API Client Configuration
 * Creates and configures an axios instance with base URL, API key, and interceptors
 */

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BaseUrl,
//   timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': XApiKey,
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle common error cases
    if (error.response?.status === 401) {
      console.error('Unauthorized access - Token may be expired or invalid');
      // Clear invalid token
      localStorage.removeItem('token');
      // You can redirect to login page here
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Forbidden - Insufficient permissions');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Internal server error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - Server took too long to respond');
    } else if (!error.response) {
      console.error('Network error - Please check your internet connection');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
