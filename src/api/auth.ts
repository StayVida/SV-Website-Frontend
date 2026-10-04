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
  name?: string;
  phoneNumber?: string;
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
    const response = await apiClient.post('/otplogin/get-otp', {
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
 * Send device information to backend for logging
 */
export const sendDeviceInfo = async (email: string): Promise<void> => {
  try {
    const userAgentData = (navigator as any).userAgentData;

    let deviceModel = "Unknown";
    let platform = "Unknown";
    let platformVersion = "Unknown";
    let architecture = "Unknown";
    let bitness = "Unknown";
    let browser = "Unknown";

    if (userAgentData?.getHighEntropyValues) {

      const data = await userAgentData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion",
        "architecture",
        "bitness",
        "fullVersionList"
      ]);

      deviceModel = data.model || "Unknown";
      platform = data.platform || "Unknown";
      platformVersion = data.platformVersion || "Unknown";
      architecture = data.architecture || "Unknown";
      bitness = data.bitness || "Unknown";

      if (data.fullVersionList?.length) {
        browser = data.fullVersionList
          .map((item: any) => `${item.brand} ${item.version}`)
          .join(", ");
      }
    }

    const deviceInfo = {
      email,

      deviceModel,
      platform,
      platformVersion,
      architecture,
      bitness,
      browser,

      // Keep these for comparison/debugging
      userAgent: navigator.userAgent,
      language: navigator.language,

      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio,
    };

    console.log("========== DEVICE INFO ==========");
    console.log("Device Model :", deviceModel);
    console.log("Platform     :", platform);
    console.log("OS Version   :", platformVersion);
    console.log("Architecture :", architecture);
    console.log("Bitness      :", bitness);
    console.log("Browser      :", browser);
    console.log("Screen       :", `${window.screen.width}x${window.screen.height}`);
    console.log("User-Agent   :", navigator.userAgent);
    console.log("=================================");

    await apiClient.post(
      '/api/device/device-info',
      deviceInfo
    );

  } catch (error) {
    console.error("Device info request error:", error);
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
 * Update user profile via PATCH /api/profile/Update
 */
export const updateProfile = async (data: { name: string; phoneNumber: string }): Promise<any> => {
  try {
    const response = await apiClient.patch('/api/profile/Update', data);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};
