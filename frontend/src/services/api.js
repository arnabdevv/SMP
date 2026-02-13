import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * API Client Configuration
 * Creates an axios instance with default credentials and headers
 * Used for all API communication with the backend
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for session management
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor - Adds authentication token to requests
 * Retrieves JWT token from localStorage and attaches to Authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handles error responses globally
 * On 401 (Unauthorized), clears session and redirects to login
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized responses (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * API Request wrapper - Provides consistent response format
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - API endpoint URL
 * @param {Object} data - Request body data (optional)
 * @returns {Object} Normalized response object with ok flag and status
 */
export const apiRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      // Support both full URLs and relative paths
      url: url.startsWith("http") ? url : `${API_BASE_URL}${url}`,
      data,
    };

    const response = await apiClient(config);
    return {
      ok: true,
      status: response.status,
      json: () => Promise.resolve(response.data),
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      status: error.response?.status || 500,
      json: () =>
        Promise.resolve(error.response?.data || { error: error.message }),
      error: error.response?.data || { error: error.message },
    };
  }
};

/**
 * Fetch wrapper for GET requests with authentication
 * @param {string} url - API endpoint URL
 * @returns {Object} API response object
 */
export const fetchWithAuth = async (url) => {
  return apiRequest("GET", url);
};

export default apiClient;
