import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (config.data !== undefined && config.data !== null) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default apiClient;
