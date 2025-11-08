/**
 * X-API-Key configuration for API authentication
 * Validates and exports the API key from environment variables
 */

const getXApiKey = (): string => {
  const apiKey = import.meta.env.VITE_X_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "VITE_X_API_KEY environment variable is not set. Please check your .env file."
    );
  }
  
  // Basic validation for API key format
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error(
      `Invalid VITE_X_API_KEY format. API key must be a non-empty string.`
    );
  }
  
  // Optional: Add more specific validation based on your API key format
  // For example, if your API keys have a specific pattern:
  // if (!/^[a-zA-Z0-9-_]+$/.test(apiKey)) {
  //   throw new Error("API key contains invalid characters");
  // }
  
  return apiKey.trim();
};

const XApiKey = getXApiKey();

export default XApiKey;