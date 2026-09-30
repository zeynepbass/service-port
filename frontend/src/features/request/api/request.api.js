import { apiClient, unwrap, unwrapPage } from "@/shared/api/client";

export async function listRequests(params) {
  return unwrapPage(await apiClient.get("/requests", { params }));
}

export async function getRequest(id) {
  return unwrap(await apiClient.get(`/requests/${id}`));
}

export async function createRequest(values) {
  return unwrap(await apiClient.post("/requests", values));
}

export async function updateRequest(id, values) {
  return unwrap(await apiClient.patch(`/requests/${id}`, values));
}

export async function changeRequestStatus(id, status) {
  return unwrap(await apiClient.patch(`/requests/${id}/status`, { status }));
}
