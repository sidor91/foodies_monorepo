import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import UserCard from "./UserCard.jsx";

const mocks = vi.hoisted(() => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
  refreshUser: vi.fn(),
  followUnwrap: vi.fn(),
  unfollowUnwrap: vi.fn(),
  refreshUnwrap: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("../../../redux/users/usersOps.js", () => ({
  followUser: mocks.followUser,
  unfollowUser: mocks.unfollowUser,
}));

vi.mock("../../../redux/auth/authOps.js", () => ({
  refreshUser: mocks.refreshUser,
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

const profileUser = {
  id: "user-2",
  name: "Mark",
  avatarUrl: "mark.jpg",
  recipesCount: 2,
  recipes: [{ id: "recipe-1", title: "Soup", image: "soup.jpg" }],
};

const renderUserCard = ({
  currentUserId = "user-1",
  followingIds = [],
  pendingIds = [],
  user,
} = {}) => {
  return renderWithProviders(<UserCard user={user || profileUser} />, {
    preloadedState: {
      auth: { user: currentUserId ? { id: currentUserId } : null },
      users: { followingIds, pendingIds },
    },
  });
};

describe("UserCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.followUnwrap.mockResolvedValue("user-2");
    mocks.unfollowUnwrap.mockResolvedValue("user-2");
    mocks.refreshUnwrap.mockResolvedValue({ id: "user-1" });
    mocks.followUser.mockImplementation(() => () => ({ unwrap: mocks.followUnwrap }));
    mocks.unfollowUser.mockImplementation(() => () => ({ unwrap: mocks.unfollowUnwrap }));
    mocks.refreshUser.mockImplementation(() => () => ({ unwrap: mocks.refreshUnwrap }));
  });

  it("renders the user details, avatar and links", () => {
    renderUserCard();

    expect(screen.getByRole("heading", { name: "Mark" })).toBeInTheDocument();
    expect(screen.getByText("Own recipes: 2")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Mark avatar" })).toHaveAttribute("src", "mark.jpg");
    expect(screen.getByRole("link", { name: "Open Soup by Mark" })).toHaveAttribute(
      "href",
      "/recipes/recipe-1",
    );
    expect(screen.getByRole("link", { name: "Open Mark profile" })).toHaveAttribute(
      "href",
      "/user/user-2",
    );
  });

  it("renders an initial and empty message when previews are unavailable", () => {
    renderUserCard({
      user: { id: "user-2", name: "Mark", avatarUrl: "", recipesCount: 0, recipes: [] },
    });

    expect(screen.getByText("M")).toBeInTheDocument();
    expect(
      screen.getByText("Nothing has been added to the user's recipe list yet."),
    ).toBeInTheDocument();
  });

  it("does not render a follow button for the current user", () => {
    renderUserCard({ currentUserId: "user-2" });

    expect(screen.queryByRole("button", { name: "Follow" })).not.toBeInTheDocument();
  });

  it("shows the unfollow state", () => {
    renderUserCard({ followingIds: ["user-2"] });

    expect(screen.getByRole("button", { name: "Unfollow" })).toBeInTheDocument();
  });

  it("disables the button while a follow request is pending", () => {
    renderUserCard({ pendingIds: ["user-2"] });

    expect(screen.getByRole("button", { name: "Updating..." })).toBeDisabled();
  });

  it("follows the user and refreshes the current user", async () => {
    const user = userEvent.setup();
    renderUserCard();

    await user.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => {
      expect(mocks.followUser).toHaveBeenCalledWith("user-2");
      expect(mocks.refreshUser).toHaveBeenCalledOnce();
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("You are now following Mark.");
  });
});
