import { describe, expect, it } from "vitest";

import { logOut } from "../auth/authOps.js";
import {
  fetchFollowers,
  fetchFollowing,
  fetchUserById,
  followUser,
  unfollowUser,
} from "./usersOps.js";
import usersReducer, { clearProfile } from "./usersSlice.js";

const createList = (items = []) => ({
  items,
  page: 1,
  limit: 2,
  total: items.length,
  totalPages: Math.ceil(items.length / 2),
});

const createInitialState = () => ({
  profile: null,
  followers: { items: [], page: 1, limit: 12, total: 0, totalPages: 0 },
  following: { items: [], page: 1, limit: 12, total: 0, totalPages: 0 },
  followingIds: [],
  pendingIds: [],
  isLoading: false,
  error: null,
});

const pagePayload = {
  items: [{ id: "user-1" }],
  page: 2,
  limit: 6,
  total: 7,
  totalPages: 2,
};

describe("usersSlice", () => {
  it("returns the initial state", () => {
    expect(usersReducer(undefined, { type: "unknown" })).toEqual(createInitialState());
  });

  it("clears the selected profile", () => {
    const state = { ...createInitialState(), profile: { id: "user-1" } };

    expect(usersReducer(state, clearProfile()).profile).toBeNull();
  });

  it("stores the selected user profile", () => {
    const profile = { id: "user-1", followersCount: 3 };

    const nextState = usersReducer(
      createInitialState(),
      fetchUserById.fulfilled(profile, "request-1", "user-1"),
    );

    expect(nextState.profile).toEqual(profile);
  });

  it("stores followers pagination", () => {
    const nextState = usersReducer(
      createInitialState(),
      fetchFollowers.fulfilled(pagePayload, "request-1", {}),
    );

    expect(nextState.followers).toEqual(pagePayload);
  });

  it("stores following users and their IDs", () => {
    const nextState = usersReducer(
      createInitialState(),
      fetchFollowing.fulfilled(pagePayload, "request-1", {}),
    );

    expect(nextState.following).toEqual(pagePayload);
    expect(nextState.followingIds).toEqual(["user-1"]);
  });

  it("does not duplicate a follow or increment the followers count twice", () => {
    const state = {
      ...createInitialState(),
      profile: { id: "user-1", followersCount: 2 },
      followingIds: ["user-1"],
    };

    const nextState = usersReducer(state, followUser.fulfilled("user-1", "request-1", "user-1"));

    expect(nextState.followingIds).toEqual(["user-1"]);
    expect(nextState.profile.followersCount).toBe(2);
  });

  it("adds a new follow and increments the profile followers count", () => {
    const state = {
      ...createInitialState(),
      profile: { id: "user-1", followersCount: 2 },
    };

    const nextState = usersReducer(state, followUser.fulfilled("user-1", "request-1", "user-1"));

    expect(nextState.followingIds).toEqual(["user-1"]);
    expect(nextState.profile.followersCount).toBe(3);
  });

  it("removes an unfollowed user and recalculates pagination", () => {
    const state = {
      ...createInitialState(),
      profile: { id: "user-1", followersCount: 2 },
      following: createList([{ id: "user-1" }, { id: "user-2" }, { id: "user-3" }]),
      followingIds: ["user-1", "user-2", "user-3"],
    };

    const nextState = usersReducer(state, unfollowUser.fulfilled("user-1", "request-1", "user-1"));

    expect(nextState.followingIds).toEqual(["user-2", "user-3"]);
    expect(nextState.following.items).toEqual([{ id: "user-2" }, { id: "user-3" }]);
    expect(nextState.following.total).toBe(2);
    expect(nextState.following.totalPages).toBe(1);
    expect(nextState.profile.followersCount).toBe(1);
  });

  it("does not reduce a profile followers count below zero", () => {
    const state = { ...createInitialState(), profile: { id: "user-1", followersCount: 0 } };

    const nextState = usersReducer(state, unfollowUser.fulfilled("user-1", "request-1", "user-1"));

    expect(nextState.profile.followersCount).toBe(0);
  });

  it("does not decrement the followers count for a repeated unfollow", () => {
    const state = {
      ...createInitialState(),
      profile: { id: "user-1", followersCount: 2 },
    };

    const nextState = usersReducer(state, unfollowUser.fulfilled("user-1", "request-1", "user-1"));

    expect(nextState.followingIds).toEqual([]);
    expect(nextState.profile.followersCount).toBe(2);
  });

  it("tracks follow requests while they are pending", () => {
    const nextState = usersReducer(createInitialState(), followUser.pending("request-1", "user-1"));

    expect(nextState.pendingIds).toEqual(["user-1"]);
  });

  it("removes a rejected follow request from pending and stores its error", () => {
    const state = { ...createInitialState(), pendingIds: ["user-1"] };
    const action = followUser.rejected(
      new Error("Request failed"),
      "request-1",
      "user-1",
      "Request failed",
    );

    const nextState = usersReducer(state, action);

    expect(nextState.pendingIds).toEqual([]);
    expect(nextState.error).toBe("Request failed");
  });

  it("tracks regular user requests and their errors", () => {
    let state = usersReducer(createInitialState(), fetchUserById.pending("request-1", "user-1"));
    expect(state.isLoading).toBe(true);

    state = usersReducer(
      state,
      fetchUserById.rejected(new Error("Not found"), "request-1", "user-1", "Not found"),
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Not found");
  });

  it("resets users after logout", () => {
    const state = { ...createInitialState(), profile: { id: "user-1" } };

    expect(usersReducer(state, logOut.fulfilled(undefined, "request-1"))).toEqual(
      createInitialState(),
    );
  });
});
