import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import UserNav from "./UserNav.jsx";

const userInfo = { id: "user-1", name: "Anna", avatarUrl: "anna.jpg" };

describe("UserNav", () => {
  it("renders the user's avatar and name", () => {
    renderWithRouter(<UserNav user={userInfo} onLogout={() => {}} isAddRecipePage={false} />);

    expect(screen.getByRole("img", { name: "Anna profile photo" })).toHaveAttribute(
      "src",
      "anna.jpg",
    );
    expect(screen.getByRole("button", { name: "Anna" })).toBeInTheDocument();
  });

  it("renders the first letter when an avatar is missing", () => {
    renderWithRouter(
      <UserNav
        user={{ id: "user-1", name: "Anna", avatarUrl: "" }}
        onLogout={() => {}}
        isAddRecipePage={false}
      />,
    );

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("opens the menu and shows the profile link", async () => {
    const user = userEvent.setup();

    renderWithRouter(<UserNav user={userInfo} onLogout={() => {}} isAddRecipePage={false} />);

    await user.click(screen.getByRole("button", { name: "Anna" }));

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/user/user-1",
    );
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("calls onLogout and closes the menu", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    renderWithRouter(<UserNav user={userInfo} onLogout={onLogout} isAddRecipePage={false} />);

    await user.click(screen.getByRole("button", { name: "Anna" }));
    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(onLogout).toHaveBeenCalledOnce();
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
  });
});
