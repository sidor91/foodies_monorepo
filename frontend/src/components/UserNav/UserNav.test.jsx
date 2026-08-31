import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import UserNav from "./UserNav.jsx";

const userInfo = { id: "user-1", name: "Anna", avatarUrl: "anna.jpg" };

const renderUserNav = (user = userInfo, props = {}) =>
  renderWithProviders(<UserNav onLogout={() => {}} {...props} />, {
    preloadedState: { auth: { user } },
  });

describe("UserNav", () => {
  it("renders the user's avatar and name", () => {
    renderUserNav();

    expect(screen.getByRole("img", { name: "Anna profile photo" })).toHaveAttribute(
      "src",
      "anna.jpg",
    );
    expect(screen.getByRole("button", { name: "Anna" })).toBeInTheDocument();
  });

  it("renders the first letter when an avatar is missing", () => {
    renderUserNav({ id: "user-1", name: "Anna", avatarUrl: "" });

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("opens the menu and shows the profile link", async () => {
    const user = userEvent.setup();

    renderUserNav();

    await user.click(screen.getByRole("button", { name: "Anna" }));

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/user/user-1");
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("calls onLogout and closes the menu", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    renderUserNav(userInfo, { onLogout });

    await user.click(screen.getByRole("button", { name: "Anna" }));
    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(onLogout).toHaveBeenCalledOnce();
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
  });

  it("closes the menu after a click outside", async () => {
    const user = userEvent.setup();
    renderUserNav();

    await user.click(screen.getByRole("button", { name: "Anna" }));
    expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
  });
});
