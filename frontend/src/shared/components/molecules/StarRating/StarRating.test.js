import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { StarRating } from "./StarRating";

function Harness() {
  const [value, setValue] = useState(0);
  return <StarRating value={value} onChange={setValue} />;
}

describe("StarRating", () => {
  it("tıklama ve ok tuşlarıyla puan seçilir", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("radio", { name: "3 yıldız" }));
    expect(screen.getByRole("radio", { name: "3 yıldız" })).toBeChecked();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "4 yıldız" })).toBeChecked();

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "2 yıldız" })).toBeChecked();
  });
});
