import { request } from "./request";

export const createRating = async (ratingData) => { 
  try {
    const result = await request("/api/ratings", {
      method: "POST",
      data: ratingData, 
    });

    if (result.status >= 400) {
      throw new Error(result.message || `HTTP error! status: ${result.status}`);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getApprovedRatings = async (options = {}) => {
  try {
    const { limit, withUserDetails } = options;
    
    let url = "/api/ratings/approved";
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit);
    if (withUserDetails) params.append('withUserDetails', 'true');
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const result = await request(url, { method: "GET" });

    if (result.status >= 400) {
      throw new Error(result.message || `HTTP error! status: ${result.status}`);
    }

    return result;
  } catch (error) {
    throw error;
  }
};