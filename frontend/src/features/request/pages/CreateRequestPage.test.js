import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API, server } from "../../../../tests/msw";
import { renderWithClient } from "../../../../tests/render";
import CreateRequestPage from "./CreateRequestPage";

const template = {
  id: "t1",
  category: { id: "c1", name: "Boya Badana", slug: "boya-badana" },
  steps: [
    { question: "Kaç oda?", options: ["1", "2"] },
    { question: "Tavan?", options: ["Evet", "Hayır"] },
  ],
};

describe("CreateRequestPage", () => {
  it("adım bazlı doğrular ve tüm cevaplarla talep oluşturur", async () => {
    const user = userEvent.setup();
    let payload;
    server.use(
      http.get(`${API}/categories/boya-badana/template`, () => HttpResponse.json({ data: template })),
      http.post(`${API}/requests`, async ({ request }) => {
        payload = await request.json();
        return HttpResponse.json({ data: { id: "r1", title: "Boya Badana" } }, { status: 201 });
      }),
    );
    renderWithClient(<CreateRequestPage slug="boya-badana" />);

    await screen.findByText("Kaç oda?");
    await user.click(screen.getByRole("button", { name: "Devam" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Devam etmek için bir seçenek belirleyin");

    await user.click(screen.getByRole("radio", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "Devam" }));
    await screen.findByText("Tavan?");

    await user.click(screen.getByRole("button", { name: "Geri" }));
    expect(await screen.findByRole("radio", { name: "2" })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Devam" }));

    await user.click(await screen.findByRole("radio", { name: "Hayır" }));
    await user.click(screen.getByRole("button", { name: "Talebi Gönder" }));

    expect(await screen.findByRole("heading", { name: "Talebini Aldık" })).toBeInTheDocument();
    expect(payload).toEqual({
      categoryId: "c1",
      answers: [
        { question: "Kaç oda?", selected: "2" },
        { question: "Tavan?", selected: "Hayır" },
      ],
    });
  });
});
