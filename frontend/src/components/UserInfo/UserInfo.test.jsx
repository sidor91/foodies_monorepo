import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import UserInfo from "./UserInfo.jsx";

const mocks = vi.hoisted(() => ({
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
  refreshUser: vi.fn(),
  updateAvatar: vi.fn(),
  followUnwrap: vi.fn(),
  unfollowUnwrap: vi.fn(),
  refreshUnwrap: vi.fn(),
  avatarUnwrap: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("../../../redux/users/usersOps.js", () => ({
  followUser: mocks.followUser,
  unfollowUser: mocks.unfollowUser,
}));

vi.mock("../../../redux/auth/authOps.js", () => ({
  refreshUser: mocks.refreshUser,
  updateAvatar: mocks.updateAvatar,
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

const profile = {
  id: "user-2",
  name: "Mark",
  email: "mark@example.com",
  avatarUrl: "mark.jpg",
  recipesCount: 3,
  favoritesCount: 4,
  followersCount: 5,
  followingCount: 6,
};

const renderUserInfo = ({
  isOwnProfile = false,
  followingIds = [],
  pendingIds = [],
  onLogout = () => {},
  onFollowChange = () => {},
  userProfile = profile,
} = {}) => {
  return renderWithProviders(
    <UserInfo
      profile={userProfile}
      isOwnProfile={isOwnProfile}
      onLogout={onLogout}
      onFollowChange={onFollowChange}
    />,
    { preloadedState: { users: { followingIds, pendingIds } } },
  );
};

describe("UserInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.followUnwrap.mockResolvedValue("user-2");
    mocks.unfollowUnwrap.mockResolvedValue("user-2");
    mocks.refreshUnwrap.mockResolvedValue({ id: "user-1" });
    mocks.avatarUnwrap.mockResolvedValue({ avatarUrl: "new-avatar.jpg" });
    mocks.followUser.mockImplementation(() => () => ({ unwrap: mocks.followUnwrap }));
    mocks.unfollowUser.mockImplementation(() => () => ({ unwrap: mocks.unfollowUnwrap }));
    mocks.refreshUser.mockImplementation(() => () => ({ unwrap: mocks.refreshUnwrap }));
    mocks.updateAvatar.mockImplementation(() => () => ({ unwrap: mocks.avatarUnwrap }));
  });

  it("renders full statistics and avatar for an own profile", () => {
    renderUserInfo({ isOwnProfile: true });

    expect(screen.getByRole("heading", { name: "Mark" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Mark avatar" })).toHaveAttribute("src", "mark.jpg");
    expect(screen.getByText("mark@example.com")).toBeInTheDocument();
    expect(screen.getByText("Favorites:")).toBeInTheDocument();
    expect(screen.getByText("Following:")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload avatar")).toBeInTheDocument();
  });

  it("renders follow controls instead of private controls for another profile", () => {
    renderUserInfo();

    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
    expect(screen.queryByText("Favorites:")).not.toBeInTheDocument();
    expect(screen.queryByText("Following:")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Upload avatar")).not.toBeInTheDocument();
  });

  it("calls onLogout from an own profile", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    renderUserInfo({ isOwnProfile: true, onLogout });

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("shows the unfollow state", () => {
    renderUserInfo({ followingIds: ["user-2"] });

    expect(screen.getByRole("button", { name: "Unfollow" })).toBeInTheDocument();
  });

  it("disables the button while a follow request is pending", () => {
    renderUserInfo({ followingIds: ["user-2"], pendingIds: ["user-2"] });

    expect(screen.getByRole("button", { name: "Updating..." })).toBeDisabled();
  });

  it("follows a user and reports the completed action", async () => {
    const user = userEvent.setup();
    const onFollowChange = vi.fn();
    renderUserInfo({ onFollowChange });

    await user.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => {
      expect(mocks.followUser).toHaveBeenCalledWith("user-2");
      expect(mocks.refreshUser).toHaveBeenCalledOnce();
      expect(onFollowChange).toHaveBeenCalledWith("follow");
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("You are now following Mark.");
  });

  it("uploads a selected avatar file", async () => {
    const user = userEvent.setup();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    renderUserInfo({ isOwnProfile: true });

    await user.upload(screen.getByLabelText("Upload avatar"), file);

    await waitFor(() => {
      expect(mocks.updateAvatar).toHaveBeenCalledWith(file);
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Avatar updated successfully.");
  });
});
