import { API_BASE } from "../config/env.js";

export async function request(path, { method = "GET", data, headers = {} } = {}) {
  const options = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    
    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Server returned ${res.status}: ${text.substring(0, 100)}`);
    }
    
    const json = await res.json();

    return {
      status: res.status, // HTTP status
      ...json,            // merge JSON body
    };
  } catch (err) {
    // If it's already our custom error, rethrow it
    if (err.message && err.message.includes("Server returned")) {
      throw err;
    }
    // Otherwise throw a generic error with details
    throw new Error(`API request failed: ${err.message}`);
  }
}
