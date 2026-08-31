import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import Header from "./Header.jsx";

const defaultProps = {
  isMobileMenuOpen: false,
  onMobileToggle: () => {},
  isLogin: false,
  isRegister: false,
  onLogin: () => {},
  onRegister: () => {},
  onLogout: () => {},
};

const renderHeader = (auth, props = {}) => {
  return renderWithProviders(<Header {...defaultProps} {...props} />, {
    preloadedState: { auth },
  });
};

describe("Header", () => {
  it("renders navigation and auth buttons for a guest", () => {
    renderHeader({ user: null, isLoggedIn: false, isRefreshing: false });

    expect(screen.getByRole("link", { name: "foodies" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Add Recipe" })).toHaveAttribute("href", "/recipe/add");
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("renders the user navigation for an authenticated user", () => {
    renderHeader({
      user: { id: "user-1", name: "Anna", avatarUrl: "" },
      isLoggedIn: true,
      isRefreshing: false,
    });

    expect(screen.getByRole("button", { name: "Anna" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "open menu" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign In" })).not.toBeInTheDocument();
  });

  it("asks a guest to log in before adding a recipe", async () => {
    const user = userEvent.setup();
    const onRequireLogin = vi.fn();

    renderHeader(
      { user: null, isLoggedIn: false, isRefreshing: false },
      { onRequireLogin },
    );

    await user.click(screen.getByRole("link", { name: "Add Recipe" }));

    expect(onRequireLogin).toHaveBeenCalledWith("/recipe/add");
  });

  it("does not ask an authenticated user to log in before adding a recipe", async () => {
    const user = userEvent.setup();
    const onRequireLogin = vi.fn();

    renderHeader(
      {
        user: { id: "user-1", name: "Anna", avatarUrl: "" },
        isLoggedIn: true,
        isRefreshing: false,
      },
      { onRequireLogin },
    );

    await user.click(screen.getByRole("link", { name: "Add Recipe" }));

    expect(onRequireLogin).not.toHaveBeenCalled();
  });

  it("calls onMobileToggle from the menu button", async () => {
    const user = userEvent.setup();
    const onMobileToggle = vi.fn();

    renderHeader(
      {
        user: { id: "user-1", name: "Anna", avatarUrl: "" },
        isLoggedIn: true,
        isRefreshing: false,
      },
      { onMobileToggle },
    );

    await user.click(screen.getByRole("button", { name: "open menu" }));

    expect(onMobileToggle).toHaveBeenCalledOnce();
  });
});
