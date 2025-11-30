import { request } from "./request";

export const getUmrahTrips = (limit = null) =>
  request(`/api/guided-trips/type/umrah${limit ? `?limit=${limit}` : ''}`, { method: "GET" });

export const getGuidedTrips = (limit = null) =>
  request(`/api/guided-trips/type/guided_trip${limit ? `?limit=${limit}` : ''}`, { method: "GET" });