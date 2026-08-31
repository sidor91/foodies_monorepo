import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import Hero from "./Hero.jsx";

vi.mock("../index.js", () => ({
  Button: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Hero", () => {
  it("renders the main content and add-recipe link", () => {
    renderWithRouter(<Hero />);

    expect(
      screen.getByRole("heading", { name: "Improve your culinary talents" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/amazing recipes for beginners/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add recipe" })).toHaveAttribute(
      "href",
      "/recipe/add",
    );
  });

  it("renders both hero images", () => {
    renderWithRouter(<Hero />);

    expect(screen.getByRole("img", { name: "Foodies dessert preview" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Featured Foodies dish" })).toBeInTheDocument();
  });
});
