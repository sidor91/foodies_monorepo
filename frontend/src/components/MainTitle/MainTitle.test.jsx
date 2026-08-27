import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MainTitle from "./MainTitle.jsx";

describe("MainTitle", () => {
  it("renders its text as a level 1 heading", () => {
    render(<MainTitle>Popular recipes</MainTitle>);

    expect(screen.getByRole("heading", { level: 1, name: "Popular recipes" })).toBeInTheDocument();
  });

  it("adds a custom class name", () => {
    render(<MainTitle className="custom-title">Popular recipes</MainTitle>);

    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("custom-title");
  });
});
