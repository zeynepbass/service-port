import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { useRouter } from "next/navigation";
import { describe, expect, it } from "vitest";
import { queryKeys } from "@/shared/api/queryKeys";
import { API, server } from "../../../../tests/msw";
import { renderWithClient } from "../../../../tests/render";
import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("geçersiz alanlarda istek atmadan hata gösterir", async () => {
    const user = userEvent.setup();
    renderWithClient(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Giriş Yap" }));

    expect(await screen.findByText("E-posta zorunludur")).toBeInTheDocument();
    expect(screen.getByLabelText("E-posta")).toHaveAttribute("aria-invalid", "true");
  });

  it("başarılı girişte oturumu cache'e yazar ve güvenli adrese yönlendirir", async () => {
    const user = userEvent.setup();
    let body;
    server.use(
      http.post(`${API}/auth/login`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ data: { id: "u1", firstName: "Ayşe" } });
      }),
    );
    const { queryClient } = renderWithClient(<LoginPage nextPath="//kotu.example.com" />);

    await user.type(screen.getByLabelText("E-posta"), " AYSE@example.com ");
    await user.type(screen.getByLabelText("Parola"), "Parola123");
    await user.click(screen.getByRole("button", { name: "Giriş Yap" }));

    await waitFor(() => expect(useRouter().replace).toHaveBeenCalledWith("/ana-sayfa"));
    expect(body).toEqual({ email: "ayse@example.com", password: "Parola123" });
    expect(queryClient.getQueryData(queryKeys.session)).toMatchObject({ id: "u1" });
  });
});
