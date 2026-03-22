/**
 * Base URI configuration for API endpoints
 * Validates and exports the base URL from environment variables
 */

const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  if (!baseUrl) {
    console.error(
      "VITE_BASE_URL environment variable is not set. Please check your .env file."
    );
    return "https://api.stayvida.in"; // Fallback to avoid crash
  }
  
  try {
    new URL(baseUrl);
  } catch {
    console.error(
      `Invalid VITE_BASE_URL format: "${baseUrl}". Please provide a valid URL (e.g., https://api.example.com)`
    );
    return "https://api.stayvida.in"; // Fallback
  }
  
  return baseUrl;
};

const BaseUrl = getBaseUrl();

export default BaseUrl;
