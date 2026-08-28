import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Icon from "./Icon.jsx";

describe("Icon", () => {
  it("renders the icon with the correct name", () => {
    render(<Icon name="heart" aria-label="Heart icon" />);

    const icon = screen.getByLabelText("Heart icon");
    const iconUse = icon.querySelector("use");

    expect(iconUse).toHaveAttribute("href", "/icons.svg#icon-heart");
  });

  it("uses the default size", () => {
    render(<Icon name="heart" aria-label="Heart icon" />);

    const icon = screen.getByLabelText("Heart icon");

    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("uses the provided size", () => {
    render(<Icon name="heart" size={40} aria-label="Heart icon" />);

    const icon = screen.getByLabelText("Heart icon");

    expect(icon).toHaveAttribute("width", "40");
    expect(icon).toHaveAttribute("height", "40");
  });
});
