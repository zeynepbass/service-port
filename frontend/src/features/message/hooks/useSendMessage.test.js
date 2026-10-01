import { act, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { queryKeys } from "@/shared/api/queryKeys";
import { API, server } from "../../../../tests/msw";
import { renderHookWithClient } from "../../../../tests/render";
import { useSendMessage } from "./useSendMessage";

function seed(queryClient) {
  queryClient.setQueryData(queryKeys.messages("c1"), {
    pages: [{ items: [{ id: "m0", text: "eski", senderId: "u2" }], meta: {} }],
    pageParams: [undefined],
  });
}

function items(queryClient) {
  return queryClient.getQueryData(queryKeys.messages("c1")).pages[0].items;
}

describe("useSendMessage", () => {
  it("mesajı iyimser ekler ve sunucu yanıtıyla değiştirir", async () => {
    let release;
    server.use(
      http.post(`${API}/messages/conversations/c1/messages`, async () => {
        await new Promise((resolve) => {
          release = resolve;
        });
        return HttpResponse.json({ data: { id: "m1", text: "selam", senderId: "u1" } }, { status: 201 });
      }),
    );
    const { result, queryClient } = renderHookWithClient(() => useSendMessage("c1", "u1", "u2"));
    seed(queryClient);

    act(() => result.current.form.setValue("text", "selam"));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(items(queryClient)[0]).toMatchObject({ text: "selam", pending: true }));
    release();
    await waitFor(() => expect(items(queryClient)[0]).toMatchObject({ id: "m1" }));
    expect(items(queryClient)).toHaveLength(2);
  });

  it("socket ile önce gelen mesajı çoğaltmaz", async () => {
    let release;
    server.use(
      http.post(`${API}/messages/conversations/c1/messages`, async () => {
        await new Promise((resolve) => {
          release = resolve;
        });
        return HttpResponse.json({ data: { id: "m1", text: "selam", senderId: "u1" } }, { status: 201 });
      }),
    );
    const { result, queryClient } = renderHookWithClient(() => useSendMessage("c1", "u1", "u2"));
    seed(queryClient);

    act(() => result.current.form.setValue("text", "selam"));
    await act(() => result.current.onSubmit());
    await waitFor(() => expect(release).toBeDefined());

    queryClient.setQueryData(queryKeys.messages("c1"), (data) => ({
      ...data,
      pages: [{ ...data.pages[0], items: [{ id: "m1", text: "selam" }, ...data.pages[0].items] }],
    }));
    release();

    await waitFor(() => expect(items(queryClient).some((item) => item.pending)).toBe(false));
    expect(items(queryClient).filter((item) => item.id === "m1")).toHaveLength(1);
  });

  it("hata durumunda iyimser mesajı geri alır ve metni korur", async () => {
    server.use(
      http.post(`${API}/messages/conversations/c1/messages`, () =>
        HttpResponse.json({ error: { message: "olmadı" } }, { status: 500 }),
      ),
    );
    const { result, queryClient } = renderHookWithClient(() => useSendMessage("c1", "u1", "u2"));
    seed(queryClient);

    act(() => result.current.form.setValue("text", "selam"));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(result.current.form.getValues("text")).toBe("selam"));
    expect(items(queryClient)).toHaveLength(1);
  });
});
