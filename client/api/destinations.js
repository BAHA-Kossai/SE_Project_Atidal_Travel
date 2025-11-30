import { request } from "./request";

export const getFeaturedDestinations = (limit = 3) =>
  request(`/api/destinations/featured?limit=${limit}`, { method: "GET" });

export const getAllDestinations = () =>
  request("/api/destinations", { method: "GET" });

export const searchDestinations = (query) =>
  request(`/api/destinations/search?q=${query}`, { method: "GET" });