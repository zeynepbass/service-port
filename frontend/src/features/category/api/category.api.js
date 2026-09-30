import { apiClient, unwrap } from "@/shared/api/client";

export async function getCategories() {
  return unwrap(await apiClient.get("/categories"));
}

export async function getCategory(key) {
  return unwrap(await apiClient.get(`/categories/${encodeURIComponent(key)}`));
}

export async function getTemplate(key) {
  return unwrap(await apiClient.get(`/categories/${encodeURIComponent(key)}/template`));
}
