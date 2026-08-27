import { describe, expect, it } from "vitest";

import {
  selectAuthError,
  selectAuthIsLoading,
  selectIsLoggedIn,
  selectIsRefreshing,
  selectUser,
} from "./authSelectors.js";

const state = {
  auth: {
    user: { id: "user-1" },
    isLoggedIn: true,
    isRefreshing: false,
    isLoading: true,
    error: "Request failed",
  },
};

describe("authSelectors", () => {
  it("selects the authenticated user", () => {
    expect(selectUser(state)).toEqual({ id: "user-1" });
  });

  it("selects the login status", () => {
    expect(selectIsLoggedIn(state)).toBe(true);
  });

  it("selects the refresh status", () => {
    expect(selectIsRefreshing(state)).toBe(false);
  });

  it("selects the loading status", () => {
    expect(selectAuthIsLoading(state)).toBe(true);
  });

  it("selects the authentication error", () => {
    expect(selectAuthError(state)).toBe("Request failed");
  });
});
