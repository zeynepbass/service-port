import { apiClient, unwrap } from "@/shared/api/client";

export async function updateProfile(formData) {
  return unwrap(await apiClient.patch("/users/me", formData));
}

export async function deactivateAccount() {
  await apiClient.post("/users/me/deactivate");
}

export async function deleteAccount(password) {
  await apiClient.delete("/users/me", { data: { password } });
}

export async function getUser(id) {
  return unwrap(await apiClient.get(`/users/${id}`));
}
