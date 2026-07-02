import axios from "axios";

const isServer = typeof window === "undefined";
const serverBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: serverBaseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (config.data !== undefined && config.data !== null && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default apiClient;
