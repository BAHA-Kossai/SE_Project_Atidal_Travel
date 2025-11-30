import { request } from "./request";

export const getActiveBranches = (limit = null) => {
  const params = limit ? `?limit=${limit}` : '';
  return request(`/api/branches/active${params}`, {
    method: "GET"
  });
};

export const getBranchById = (id) =>
  request(`/api/branches/${id}`, { method: "GET" });

export const createBranch = (branchData) =>
  request("/api/branches", {
    method: "POST",
    data: branchData,
  });

export const updateBranch = (id, branchData) =>
  request(`/api/branches/${id}`, {
    method: "PUT",
    data: branchData,
  });