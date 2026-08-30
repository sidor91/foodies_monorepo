import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import Button from "./Button.jsx";

describe("Button", () => {
  it("renders a native button and calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithRouter(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies variant, active and custom classes", () => {
    renderWithRouter(
      <Button variant="secondary" isActive className="custom">
        Filter
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Filter" })).toHaveClass(
      "btn",
      "btn__secondary",
      "btn__active",
      "custom",
    );
  });

  it("renders a link when to is provided", () => {
    renderWithRouter(<Button to="/recipe/add">Add recipe</Button>);

    expect(screen.getByRole("link", { name: "Add recipe" })).toHaveAttribute(
      "href",
      "/recipe/add",
    );
  });

  it("blocks a disabled link click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithRouter(
      <Button to="/recipe/add" disabled onClick={onClick}>
        Add recipe
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Add recipe" });
    await user.click(link);

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(onClick).not.toHaveBeenCalled();
  });
});
