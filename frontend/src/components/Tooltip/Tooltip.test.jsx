import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Tooltip from "./Tooltip.jsx";

describe("Tooltip", () => {
  it("renders the child and tooltip content", () => {
    render(
      <Tooltip content="Recipe title">
        <button type="button">Open recipe</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Open recipe" })).toBeInTheDocument();

    expect(screen.getByRole("tooltip")).toHaveTextContent("Recipe title");
  });

  it("connects the wrapper to the tooltip with aria-describedby", () => {
    const { container } = render(
      <Tooltip content="Recipe title">
        <button type="button">Recipe preview</button>
      </Tooltip>,
    );

    const wrapper = container.firstElementChild;
    const tooltip = screen.getByRole("tooltip");

    expect(wrapper).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("renders only the child when content is empty", () => {
    render(
      <Tooltip content="">
        <button type="button">Open recipe</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Open recipe" })).toBeInTheDocument();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("applies a custom class to the wrapper", () => {
    const { container } = render(
      <Tooltip content="Recipe title" className="custom-class">
        <button type="button">Open recipe</button>
      </Tooltip>,
    );

    expect(container.firstElementChild).toHaveClass("custom-class");
  });
});
