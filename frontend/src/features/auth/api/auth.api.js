import { apiClient, unwrap } from "@/shared/api/client";

export async function login(credentials) {
  return unwrap(await apiClient.post("/auth/login", credentials));
}

export async function register(values) {
  return unwrap(await apiClient.post("/auth/register", values));
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function requestPasswordReset(values) {
  return unwrap(await apiClient.post("/auth/forgot-password", values));
}

export async function resetPassword(values) {
  return unwrap(await apiClient.post("/auth/reset-password", values));
}

export async function getSession() {
  return unwrap(await apiClient.get("/users/me"));
}
