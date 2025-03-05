import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./config";

const getTokenFromCookie = (): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const authTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("auth-token=")
  );

  if (authTokenCookie) {
    return authTokenCookie.split("=")[1];
  }

  return null;
};

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
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
