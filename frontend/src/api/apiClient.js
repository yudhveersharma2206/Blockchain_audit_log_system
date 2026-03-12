/**
 * Centralized API Client with Interceptors
 * Handles authentication tokens, error handling, and base URL
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Generic fetch wrapper with error handling
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization token if exists
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Check if token is expired (401 response)
    if (response.status === 401 && data.message?.includes("Token expired")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      status: 500,
      data: { message: "Network error. Please try again." },
    };
  }
};

/**
 * Authentication API calls
 */
export const authAPI = {
  register: (username, password, role = "viewer") =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
    }),

  login: (username, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getUsers: () =>
    apiCall("/auth/users", {
      method: "GET",
    }),

  createUser: (username, password, role) =>
    apiCall("/auth/create-user", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
    }),

  deleteUser: (userId) =>
    apiCall(`/auth/user/${userId}`, {
      method: "DELETE",
    }),
};

/**
 * Blockchain/Log API calls
 */
export const blockchainAPI = {
  addLog: (action, user) =>
    apiCall("/add-log", {
      method: "POST",
      body: JSON.stringify({ action, user }),
    }),

  getAllBlocks: (page = 1, limit = 50) =>
    apiCall(`/blocks?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  filterBlocks: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/blocks/filter?${params}`, {
      method: "GET",
    });
  },

  getBlockById: (id) =>
    apiCall(`/block/${id}`, {
      method: "GET",
    }),

  verifyBlockchain: () =>
    apiCall("/verify", {
      method: "GET",
    }),
};

/**
 * Health check
 */
export const healthCheck = () =>
  apiCall("/health", {
    method: "GET",
  });

export default { authAPI, blockchainAPI, healthCheck };
