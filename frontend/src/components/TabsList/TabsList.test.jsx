import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TabsList from "./TabsList.jsx";

describe("TabsList", () => {
  it("renders all tabs for the user's own profile", () => {
    render(<TabsList activeTab="recipes" isOwnProfile onTabChange={() => {}} />);

    expect(screen.getByRole("button", { name: "My recipes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My favorites" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Followers" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Following" })).toBeInTheDocument();
  });

  it("renders only public tabs for another profile", () => {
    render(<TabsList activeTab="recipes" isOwnProfile={false} onTabChange={() => {}} />);

    expect(screen.getByRole("button", { name: "Recipes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Followers" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "My favorites" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Following" })).not.toBeInTheDocument();
  });

  it("marks the active tab as pressed", () => {
    render(<TabsList activeTab="favorites" isOwnProfile onTabChange={() => {}} />);

    expect(screen.getByRole("button", { name: "My favorites" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onTabChange with the selected tab", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(<TabsList activeTab="recipes" isOwnProfile onTabChange={onTabChange} />);

    await user.click(screen.getByRole("button", { name: "My favorites" }));

    expect(onTabChange).toHaveBeenCalledOnce();
    expect(onTabChange).toHaveBeenCalledWith("favorites");
  });
});
