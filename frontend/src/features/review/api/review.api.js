import { apiClient, unwrap, unwrapPage } from "@/shared/api/client";

export async function createReview(values) {
  return unwrap(await apiClient.post("/reviews", values));
}

export async function listReviews(userId, cursor) {
  return unwrapPage(await apiClient.get("/reviews", { params: { user: userId, cursor } }));
}
