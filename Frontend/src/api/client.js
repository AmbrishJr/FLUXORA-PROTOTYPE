import axios from "axios";

// Simple axios client pointing to the Fluxora backend.
// Adjust BASE_URL if your backend runs on a different host/port.
export const BASE_URL = "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL
});

export default client;

