import apiClient from './axios';

/**
 * Authentication API service
 * Handles login, logout, and user authentication
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  username: string;
  email: string;
  role: string;
  message: string;
  userID?: number;
}

export interface OtpRequest {
  username: string;
  email: string;
}

export interface OtpVerifyRequest {
  username: string;
  email: string;
  otp: string;
}

export interface User {
  username: string;
  email: string;
  role: string;
}

/**
 * Login user with email and password
 */
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Login via Google OAuth token
 * Hits baseUri /login with provider and OAuth token
 */
export const loginWithGoogle = async (oauthToken: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.get<LoginResponse>('/login', {
      params: {
        provider: 'google',
        token: oauthToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

/**
 * Request OTP for login
 * Hits /otplogin/verify-otp with email and empty username
 */
export const requestOtp = async (email: string): Promise<void> => {
  try {
    const response = await apiClient.post('/otplogin/verify-otp', {
      username: '',
      email: email,
    });
    // On 200 status, OTP is sent
    if (response.status === 200) {
      return;
    }
    throw new Error('Failed to send OTP');
  } catch (error) {
    console.error('OTP request error:', error);
    throw error;
  }
};

/**
 * Verify OTP and complete login
 * Hits /otplogin/verify-otp with email, empty username, and OTP
 */
export const verifyOtp = async (email: string, otp: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/otplogin/verify-otp', {
      username: '',
      email: email,
      otp: otp,
    });
    return response.data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

/**
 * Logout user by removing token from localStorage
 */
export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (userData: User, token: string): void => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
};

/**
 * Create or update user profile
 */
export const createProfile = async (data: { name: string; phoneNumber: string }): Promise<any> => {
  try {
    const response = await apiClient.post('/api/profile/create', data);
    return response.data;
  } catch (error) {
    console.error('Create profile error:', error);
    throw error;
  }
};
