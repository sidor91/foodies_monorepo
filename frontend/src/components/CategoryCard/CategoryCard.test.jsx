import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import CategoryCard from "./CategoryCard.jsx";

describe("CategoryCard", () => {
  it("renders the category name", () => {
    renderWithRouter(<CategoryCard name="Dessert" image="dessert.jpg" />);

    expect(screen.getByRole("button", { name: "Dessert" })).toBeInTheDocument();
  });

  it("calls onSelect from the name button", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithRouter(<CategoryCard name="Dessert" image="dessert.jpg" onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Dessert" }));

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("calls onSelect from the icon button", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithRouter(<CategoryCard name="Dessert" image="dessert.jpg" onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Open Dessert category" }));

    expect(onSelect).toHaveBeenCalledOnce();
  });
});
