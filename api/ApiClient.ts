import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./config";
import { getTokenFromCookie, logout } from "@/shared/utils/auth";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('🚫 401 Unauthorized error received - triggering logout');
      console.log('Error details:', error.response);
      
      // Auth utility'den logout fonksiyonunu kullan
      logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
