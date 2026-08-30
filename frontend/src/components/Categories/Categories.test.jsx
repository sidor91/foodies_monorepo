import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Categories from "./Categories.jsx";

vi.mock("../CategoryCard/CategoryCard.jsx", () => ({
  default: ({ name, image, onSelect }) => (
    <button type="button" data-image={image} onClick={onSelect}>
      {name}
    </button>
  ),
}));

const categories = Array.from({ length: 12 }, (_, index) => ({
  id: `category-${index + 1}`,
  name: index === 0 ? "Dessert" : `Category ${index + 1}`,
}));

describe("Categories", () => {
  it("shows loading when categories have not loaded yet", () => {
    render(<Categories categories={[]} isLoading />);

    expect(screen.getByText("Loading categories...")).toBeInTheDocument();
  });

  it("shows an error when categories are unavailable", () => {
    render(<Categories categories={[]} error="Request failed" />);

    expect(screen.getByText("Categories are unavailable right now.")).toBeInTheDocument();
  });

  it("shows the first eleven categories and the all-categories button", () => {
    render(<Categories categories={categories} />);

    expect(screen.getByRole("button", { name: "Category 11" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Category 12" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All categories" })).toBeInTheDocument();
  });

  it("shows every category in expanded mode", () => {
    render(<Categories categories={categories} isAllExpanded />);

    expect(screen.getByRole("button", { name: "Category 12" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "All categories" })).not.toBeInTheDocument();
  });

  it("uses the Desserts asset alias", () => {
    render(<Categories categories={categories.slice(0, 1)} />);

    expect(screen.getByRole("button", { name: "Dessert" })).toHaveAttribute(
      "data-image",
      "/categories/Desserts.webp",
    );
  });

  it("returns the selected category", async () => {
    const user = userEvent.setup();
    const onCategorySelect = vi.fn();
    render(<Categories categories={categories} onCategorySelect={onCategorySelect} />);

    await user.click(screen.getByRole("button", { name: "Dessert" }));

    expect(onCategorySelect).toHaveBeenCalledWith(categories[0]);
  });

  it("calls onShowAllCategories", async () => {
    const user = userEvent.setup();
    const onShowAllCategories = vi.fn();
    render(<Categories categories={categories} onShowAllCategories={onShowAllCategories} />);

    await user.click(screen.getByRole("button", { name: "All categories" }));

    expect(onShowAllCategories).toHaveBeenCalledOnce();
  });
});
