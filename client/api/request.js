import { API_BASE } from "../config/env.js";

export async function request(path, { method = "GET", data, headers = {} } = {}) {
  const options = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_BASE}${path}`, options);
  const json = await res.json();

  return {
    status: res.status, // HTTP status
    ...json,            // merge JSON body
  };
}
