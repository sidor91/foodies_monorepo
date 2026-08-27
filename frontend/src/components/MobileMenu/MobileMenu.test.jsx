import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import MobileMenu from "./MobileMenu.jsx";

describe("MobileMenu", () => {
  it("renders navigation links and menu images", () => {
    renderWithRouter(<MobileMenu isMobileMenuOpen onMobileToggle={() => {}} />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Add Recipe" })).toHaveAttribute("href", "/recipe/add");
    expect(screen.getByRole("img", { name: "Tiramisu dish" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Dish with meat roll" })).toBeInTheDocument();
  });

  it("calls onMobileToggle from the close button", async () => {
    const user = userEvent.setup();
    const onMobileToggle = vi.fn();

    renderWithRouter(<MobileMenu isMobileMenuOpen onMobileToggle={onMobileToggle} />);

    await user.click(screen.getByRole("button", { name: "Close Modal" }));

    expect(onMobileToggle).toHaveBeenCalledOnce();
  });

  it("calls onMobileToggle after a navigation link is clicked", async () => {
    const user = userEvent.setup();
    const onMobileToggle = vi.fn();

    renderWithRouter(<MobileMenu isMobileMenuOpen onMobileToggle={onMobileToggle} />);

    await user.click(screen.getByRole("link", { name: "Add Recipe" }));

    expect(onMobileToggle).toHaveBeenCalledOnce();
  });
});
