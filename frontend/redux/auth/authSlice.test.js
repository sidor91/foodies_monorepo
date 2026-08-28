import { describe, expect, it } from "vitest";

import { logIn, logOut, refreshUser, register, updateAvatar } from "./authOps.js";
import authReducer, { clearAuthError } from "./authSlice.js";

const initialState = {
  user: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

describe("authSlice", () => {
  it("returns the initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("clears an authentication error", () => {
    const state = { ...initialState, error: "Login failed" };

    expect(authReducer(state, clearAuthError()).error).toBeNull();
  });

  it("starts a login request", () => {
    const state = { ...initialState, error: "Old error" };

    const nextState = authReducer(state, logIn.pending("request-1", {}));

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("stores the user after a successful login", () => {
    const user = { id: "user-1", name: "Alex" };

    const nextState = authReducer(initialState, logIn.fulfilled(user, "request-1", {}));

    expect(nextState.user).toEqual(user);
    expect(nextState.isLoggedIn).toBe(true);
    expect(nextState.isLoading).toBe(false);
  });

  it("stores the user after successful registration", () => {
    const user = { id: "user-2", name: "Maria" };

    const nextState = authReducer(initialState, register.fulfilled(user, "request-1", {}));

    expect(nextState.user).toEqual(user);
    expect(nextState.isLoggedIn).toBe(true);
  });

  it("stores a rejected authentication error", () => {
    const action = logIn.rejected(new Error("Login failed"), "request-1", {}, "Login failed");

    const nextState = authReducer({ ...initialState, isLoading: true }, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe("Login failed");
  });

  it("resets authentication after logout", () => {
    const state = { ...initialState, user: { id: "user-1" }, isLoggedIn: true };

    expect(authReducer(state, logOut.fulfilled(undefined, "request-1"))).toEqual(initialState);
  });

  it("marks the session refresh as pending", () => {
    const nextState = authReducer(initialState, refreshUser.pending("request-1"));

    expect(nextState.isRefreshing).toBe(true);
  });

  it("restores the user after a successful session refresh", () => {
    const user = { id: "user-1", name: "Alex" };
    const state = { ...initialState, isRefreshing: true };

    const nextState = authReducer(state, refreshUser.fulfilled(user, "request-1"));

    expect(nextState.user).toEqual(user);
    expect(nextState.isLoggedIn).toBe(true);
    expect(nextState.isRefreshing).toBe(false);
  });

  it("clears authentication after a rejected session refresh", () => {
    const state = {
      ...initialState,
      user: { id: "user-1" },
      isLoggedIn: true,
      isRefreshing: true,
    };

    const nextState = authReducer(
      state,
      refreshUser.rejected(new Error("Unauthorized"), "request-1"),
    );

    expect(nextState.user).toBeNull();
    expect(nextState.isLoggedIn).toBe(false);
    expect(nextState.isRefreshing).toBe(false);
  });

  it("updates the avatar of the authenticated user", () => {
    const state = { ...initialState, user: { id: "user-1", avatarUrl: "old.jpg" } };

    const nextState = authReducer(
      state,
      updateAvatar.fulfilled({ avatarUrl: "new.jpg" }, "request-1", new File([], "avatar.jpg")),
    );

    expect(nextState.user.avatarUrl).toBe("new.jpg");
    expect(nextState.isLoading).toBe(false);
  });

  it("does not create a user when an avatar update completes without one", () => {
    const nextState = authReducer(
      initialState,
      updateAvatar.fulfilled({ avatarUrl: "new.jpg" }, "request-1", new File([], "avatar.jpg")),
    );

    expect(nextState.user).toBeNull();
  });
});
