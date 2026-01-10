// API configuration for both development and production
// In production (Vercel), API routes are at /api
// In development, you can set VITE_API_URL to point to your local backend
const getApiBaseUrl = () => {
  // If VITE_API_URL is set, use it (for local development with separate backend)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // For production (Vercel), use relative path
  // For local development with Vercel dev, also use relative path
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
