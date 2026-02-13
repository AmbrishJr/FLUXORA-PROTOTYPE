import axios from "axios";

// Simple axios client pointing to the Fluxora backend.
// Automatically switches between development and production URLs.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL
});

export default client;
export { BASE_URL };

