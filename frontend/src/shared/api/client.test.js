import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API, server } from "../../../tests/msw";
import { apiClient, getErrorMessage, setSessionExpiredHandler } from "./client";

describe("apiClient", () => {
  it("çerezlerle istek atar", () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
    expect(apiClient.defaults.baseURL).toBe(API);
  });

  it("401 aldığında oturumu yenileyip isteği tekrarlar", async () => {
    let calls = 0;
    const refresh = vi.fn(() => HttpResponse.json({ data: {} }));
    server.use(
      http.get(`${API}/users/me`, () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 })
          : HttpResponse.json({ data: { id: "1" } });
      }),
      http.post(`${API}/auth/refresh`, refresh),
    );

    const response = await apiClient.get("/users/me");

    expect(response.data.data.id).toBe("1");
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("eşzamanlı 401'lerde tek bir refresh isteği atar", async () => {
    const refresh = vi.fn(() => HttpResponse.json({ data: {} }));
    const seen = new Set();
    server.use(
      http.get(`${API}/items/:id`, ({ params }) => {
        if (!seen.has(params.id)) {
          seen.add(params.id);
          return new HttpResponse(null, { status: 401 });
        }
        return HttpResponse.json({ data: params.id });
      }),
      http.post(`${API}/auth/refresh`, refresh),
    );

    await Promise.all([apiClient.get("/items/a"), apiClient.get("/items/b")]);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("refresh başarısız olursa oturumu kapatır", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    server.use(
      http.get(`${API}/users/me`, () => new HttpResponse(null, { status: 401 })),
      http.post(`${API}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),
    );

    await expect(apiClient.get("/users/me")).rejects.toBeTruthy();
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("giriş isteğindeki 401 için refresh denemez", async () => {
    const refresh = vi.fn(() => HttpResponse.json({ data: {} }));
    server.use(
      http.post(`${API}/auth/login`, () =>
        HttpResponse.json({ error: { message: "E-posta veya parola hatalı" } }, { status: 401 }),
      ),
      http.post(`${API}/auth/refresh`, refresh),
    );

    const error = await apiClient.post("/auth/login", {}).catch((caught) => caught);
    expect(getErrorMessage(error)).toBe("E-posta veya parola hatalı");
    expect(refresh).not.toHaveBeenCalled();
  });
});
