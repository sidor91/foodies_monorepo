import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import Footer from "./Footer.jsx";

describe("Footer", () => {
  it("renders the logo link and social links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByRole("link", { name: "foodies" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Youtube" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
  });

  it("shows the current year", () => {
    renderWithRouter(<Footer />);

    const currentYear = new Date().getFullYear();

    expect(
      screen.getByText(`©${currentYear}, Foodies. All rights reserved`),
    ).toBeInTheDocument();
  });
});
