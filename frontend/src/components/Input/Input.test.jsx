import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Input from "./Input.jsx";

describe("Input", () => {
  it("forwards standard input attributes", () => {
    render(<Input aria-label="Recipe title" name="title" placeholder="Title" />);

    const input = screen.getByRole("textbox", { name: "Recipe title" });
    expect(input).toHaveAttribute("name", "title");
    expect(input).toHaveAttribute("placeholder", "Title");
  });

  it("applies variant, active and custom classes", () => {
    render(<Input aria-label="Search" variant="secondary" isActive className="custom" />);

    expect(screen.getByRole("textbox", { name: "Search" })).toHaveClass(
      "input",
      "input__secondary",
      "input__active",
      "custom",
    );
  });

  it("can be disabled", () => {
    render(<Input aria-label="Search" disabled />);

    expect(screen.getByRole("textbox", { name: "Search" })).toBeDisabled();
  });
});
