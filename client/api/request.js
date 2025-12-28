import { API_BASE } from "../config/env.js";

/**
 * Enhanced request utility with authentication and error handling
 */
export async function request(path, { method = "GET", data, headers = {}, requiresAuth = true } = {}) {
  try {
    // Get auth token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    
    // Build headers
    const requestHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add auth token if required and available
    if (requiresAuth && accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    const options = {
      method,
      headers: requestHeaders,
      credentials: "include", // Include cookies if needed
    };

    // Add body for non-GET requests
    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    // Verify API_BASE is set
    if (!API_BASE) {
      const error = new Error("API_BASE is not configured. Check your .env.local file.");
      console.error("🔴 [API Config Error]", error.message);
      console.log("   - API_BASE value:", API_BASE);
      console.log("   - Expected: http://localhost:3000");
      throw error;
    }

    const fullUrl = `${API_BASE}${path}`;
    
    // Log request details for debugging
    console.log(`[API Request] ${method} ${fullUrl}`, {
      headers: requestHeaders,
      body: data
    });

    const res = await fetch(fullUrl, options);
    
    // Handle non-JSON responses
    let json;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      json = await res.json();
    } else {
      // Handle text or other response types
      const text = await res.text();
      json = { message: text || "An error occurred" };
    }

    // Log response details for debugging
    console.log(`[API Response] ${method} ${API_BASE}${path}`, {
      status: res.status,
      response: json
    });

    // Handle HTTP errors
    if (!res.ok) {
      const errorMessage = json.message || json.error || json.errors || `HTTP error! status: ${res.status}`;
      const error = new Error(errorMessage);
      error.status = res.status;
      error.data = json;
      error.validationErrors = json.errors || json.validationErrors || null;
      throw error;
    }

    return {
      status: res.status,
      ...json,
    };
  } catch (error) {
    // Re-throw if it's already our custom error
    if (error.status) {
      console.error(`[API Error] ${error.status}:`, error.message, error.validationErrors);
      throw error;
    }
    
    // Handle network errors with detailed diagnostics
    let errorMessage = error.message || "Network error";
    
    if (errorMessage.includes("Failed to fetch")) {
      console.error("[Network Error - Failed to fetch]:");
      console.error("  - Check if backend is running: npm start in server directory");
      console.error("  - Check if API_BASE is correct: http://localhost:3000");
      console.error("  - Check browser Network tab for CORS errors");
      console.error("  - Check server console for errors");
      errorMessage = "Backend is not responding. Make sure the server is running at http://localhost:3000";
    } else if (errorMessage.includes("CORS")) {
      console.error("[CORS Error]:");
      console.error("  - Backend is not allowing requests from frontend");
      console.error("  - Check server/src/app.js for CORS configuration");
      errorMessage = "CORS error: Backend not allowing requests";
    }
    
    const networkError = new Error(errorMessage);
    networkError.status = 0;
    networkError.data = null;
    console.error("[Network Error]:", networkError.message);
    throw networkError;
  }
}

/**
 * Request utility for file uploads (FormData)
 */
export async function requestWithFormData(path, formData, { method = "POST", requiresAuth = true } = {}) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    const headers = {};
    if (requiresAuth && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const options = {
      method,
      headers,
      body: formData,
      credentials: "include",
    };

    const res = await fetch(`${API_BASE}${path}`, options);
    
    let json;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      json = await res.json();
    } else {
      const text = await res.text();
      json = { message: text || "An error occurred" };
    }

    if (!res.ok) {
      const error = new Error(json.message || json.error || `HTTP error! status: ${res.status}`);
      error.status = res.status;
      error.data = json;
      throw error;
    }

    return {
      status: res.status,
      ...json,
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }
    
    const networkError = new Error(error.message || "Network error. Please check your connection.");
    networkError.status = 0;
    networkError.data = null;
    throw networkError;
  }
}
