import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

function renderModal(onClose = vi.fn()) {
  render(
    <>
      <button type="button">Dışarıdaki</button>
      <Modal open onClose={onClose} title="Başlık" description="Açıklama">
        <button type="button">Birinci</button>
        <button type="button">İkinci</button>
      </Modal>
    </>,
  );
  return onClose;
}

describe("Modal", () => {
  it("erişilebilir dialog olarak açılır ve ilk öğeye odaklanır", () => {
    renderModal();
    const dialog = screen.getByRole("dialog", { name: "Başlık" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Açıklama");
    expect(screen.getByRole("button", { name: "Kapat" })).toHaveFocus();
  });

  it("Tab ile odak dialog içinde döner", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "İkinci" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Kapat" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "İkinci" })).toHaveFocus();
  });

  it("Escape ile kapanır", async () => {
    const user = userEvent.setup();
    const onClose = renderModal();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
