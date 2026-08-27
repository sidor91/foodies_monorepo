import { describe, expect, it } from "vitest";

import {
  selectFollowers,
  selectFollowersPagination,
  selectFollowing,
  selectFollowingIds,
  selectFollowingPagination,
  selectIsFollowPending,
  selectIsFollowing,
  selectProfile,
  selectUsersError,
  selectUsersIsLoading,
} from "./usersSelectors.js";

const state = {
  users: {
    profile: { id: "user-1" },
    followers: { items: [{ id: "user-2" }], page: 2, limit: 6, total: 7, totalPages: 2 },
    following: { items: [{ id: "user-3" }], page: 1, limit: 12, total: 1, totalPages: 1 },
    followingIds: ["user-3"],
    pendingIds: ["user-4"],
    isLoading: true,
    error: "Request failed",
  },
};

describe("usersSelectors", () => {
  it("selects user collections and IDs", () => {
    expect(selectProfile(state)).toEqual({ id: "user-1" });
    expect(selectFollowers(state)).toEqual([{ id: "user-2" }]);
    expect(selectFollowing(state)).toEqual([{ id: "user-3" }]);
    expect(selectFollowingIds(state)).toEqual(["user-3"]);
  });

  it("selects the request status", () => {
    expect(selectUsersIsLoading(state)).toBe(true);
    expect(selectUsersError(state)).toBe("Request failed");
  });

  it("selects followers pagination", () => {
    expect(selectFollowersPagination(state)).toEqual({ page: 2, limit: 6, total: 7, totalPages: 2 });
  });

  it("selects following pagination", () => {
    expect(selectFollowingPagination(state)).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    });
  });

  it("checks whether a user is followed", () => {
    expect(selectIsFollowing("user-3")(state)).toBe(true);
    expect(selectIsFollowing("user-2")(state)).toBe(false);
  });

  it("checks whether a follow request is pending", () => {
    expect(selectIsFollowPending("user-4")(state)).toBe(true);
    expect(selectIsFollowPending("user-3")(state)).toBe(false);
  });
});
