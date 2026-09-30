import axios from "axios";
import { clientEnv } from "@/shared/config/env";

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

export const apiClient = axios.create({
  baseURL: `${clientEnv.apiUrl}/api`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

let refreshPromise = null;
let sessionExpiredHandler = () => {};

export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler;
}

export function refreshSession() {
  refreshPromise ??= apiClient.post("/auth/refresh").finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

function isAuthEndpoint(url = "") {
  return AUTH_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status !== 401 || !original || original._retried || isAuthEndpoint(original.url)) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      await refreshSession();
      return apiClient(original);
    } catch (refreshError) {
      sessionExpiredHandler();
      return Promise.reject(refreshError);
    }
  },
);

export function unwrap(response) {
  return response.data.data;
}

export function unwrapPage(response) {
  return { items: response.data.data, meta: response.data.meta };
}

export function getErrorMessage(error, fallback = "Bir hata oluştu. Lütfen tekrar deneyin.") {
  return error?.response?.data?.error?.message ?? fallback;
}
