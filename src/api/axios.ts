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
    let token = localStorage.getItem('token');

    // Fallback to authData if token is not found directly
    if (!token || token === 'null' || token === 'undefined') {
      const authData = localStorage.getItem('authData');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          // Check various possible keys for the token
          token = parsed.token || parsed.auth_token || parsed.accessToken || parsed.access_token;
        } catch (e) {
          console.error('Error parsing authData in axios interceptor:', e);
        }
      }
    }

    // Clean up the token string (remove possible extra quotes and whitespace)
    if (typeof token === 'string') {
      token = token.trim();
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }
    }

    // Ensure we have a valid token before adding the header
    if (token && token !== 'null' && token !== 'undefined' && token !== '' && config.headers) {
      // Ensure we don't double up the Bearer prefix
      const actualToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token;
      config.headers.Authorization = `Bearer ${actualToken}`;
    }

    // Normalize X-Api-Key to ensure compatibility (some servers prefer lowercase)
    if (config.headers) {
      if (!config.headers['x-api-key'] && !config.headers['X-Api-Key']) {
        config.headers['x-api-key'] = XApiKey;
      }
    }
    // console.log("token",token)

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
      localStorage.removeItem('authData');
      localStorage.removeItem('user');
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
