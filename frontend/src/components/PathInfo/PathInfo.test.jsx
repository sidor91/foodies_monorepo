import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import PathInfo from "./PathInfo.jsx";

describe("PathInfo", () => {
  it("renders the default home link and current page", () => {
    renderWithRouter(<PathInfo currentPage="Profile" />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Profile")).toHaveAttribute("aria-current", "page");
  });

  it("uses a custom home label and path", () => {
    renderWithRouter(<PathInfo currentPage="Recipe" homeLabel="Recipes" homePath="/recipes" />);

    expect(screen.getByRole("link", { name: "Recipes" })).toHaveAttribute("href", "/recipes");
    expect(screen.getByText("Recipe")).toBeInTheDocument();
  });
});
