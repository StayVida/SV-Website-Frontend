/**
 * Base URI configuration for API endpoints
 * Validates and exports the base URL from environment variables
 */

const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  if (!baseUrl) {
    throw new Error(
      "VITE_BASE_URL environment variable is not set. Please check your .env file."
    );
  }
  
  // Validate URL format
  try {
    new URL(baseUrl);
  } catch {
    throw new Error(
      `Invalid VITE_BASE_URL format: "${baseUrl}". Please provide a valid URL (e.g., https://api.example.com)`
    );
  }
  
  return baseUrl;
};

const BaseUrl = getBaseUrl();

export default BaseUrl;
