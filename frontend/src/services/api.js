import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
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

export const fetchWithAuth = async (url) => {
  return apiRequest("GET", url);
};

export default apiClient;
