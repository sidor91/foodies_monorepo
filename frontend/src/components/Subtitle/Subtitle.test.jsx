import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Subtitle from "./Subtitle.jsx";

describe("Subtitle", () => {
  it("renders the default text", () => {
    render(<Subtitle />);

    expect(
      screen.getByText(
        "Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.",
      ),
    ).toBeInTheDocument();
  });

  it("renders custom text", () => {
    render(<Subtitle>Choose your favorite recipe.</Subtitle>);

    expect(screen.getByText("Choose your favorite recipe.")).toBeInTheDocument();
  });

  it("uses the muted text style", () => {
    render(<Subtitle muted>Muted subtitle</Subtitle>);

    expect(screen.getByText("Muted subtitle")).toHaveClass("text-secondary");
  });
});
