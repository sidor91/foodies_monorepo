import { beforeEach, describe, expect, it, vi } from "vitest";

import api from "../../src/api/axios.js";
import { logIn, logOut, refreshUser, register, updateAvatar } from "./authOps.js";

vi.mock("../../src/api/axios.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const runThunk = (thunk, state = { auth: { isRefreshing: false } }) =>
  thunk(vi.fn(), () => state, undefined);

const apiError = {
  response: { data: { message: "Request failed" } },
};

describe("authOps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user and returns the response data", async () => {
    const credentials = { name: "Alex", email: "alex@example.com", password: "secret" };
    const user = { id: "user-1", email: credentials.email };
    api.post.mockResolvedValueOnce({ data: user });

    const result = await runThunk(register(credentials));

    expect(api.post).toHaveBeenCalledWith("/auth/register", credentials);
    expect(result.type).toBe(register.fulfilled.type);
    expect(result.payload).toEqual(user);
  });

  it("returns a rejected value when registration fails", async () => {
    api.post.mockRejectedValueOnce(apiError);

    const result = await runThunk(register({ email: "alex@example.com" }));

    expect(result.type).toBe(register.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("logs in a user and returns the response data", async () => {
    const credentials = { email: "alex@example.com", password: "secret" };
    const user = { id: "user-1", email: credentials.email };
    api.post.mockResolvedValueOnce({ data: user });

    const result = await runThunk(logIn(credentials));

    expect(api.post).toHaveBeenCalledWith("/auth/login", credentials);
    expect(result.type).toBe(logIn.fulfilled.type);
    expect(result.payload).toEqual(user);
  });

  it("returns a rejected value when login fails", async () => {
    api.post.mockRejectedValueOnce(apiError);

    const result = await runThunk(logIn({ email: "alex@example.com" }));

    expect(result.type).toBe(logIn.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("logs out the current user", async () => {
    api.post.mockResolvedValueOnce({});

    const result = await runThunk(logOut());

    expect(api.post).toHaveBeenCalledWith("/auth/logout");
    expect(result.type).toBe(logOut.fulfilled.type);
  });

  it("returns a rejected value when logout fails", async () => {
    api.post.mockRejectedValueOnce(apiError);

    const result = await runThunk(logOut());

    expect(result.type).toBe(logOut.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("refreshes the current user", async () => {
    const user = { id: "user-1" };
    api.get.mockResolvedValueOnce({ data: user });

    const result = await runThunk(refreshUser());

    expect(api.get).toHaveBeenCalledWith("/users/me");
    expect(result.type).toBe(refreshUser.fulfilled.type);
    expect(result.payload).toEqual(user);
  });

  it("returns a rejected value when refreshing the user fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(refreshUser());

    expect(result.type).toBe(refreshUser.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("does not refresh while another refresh request is active", async () => {
    const result = await runThunk(refreshUser(), { auth: { isRefreshing: true } });

    expect(api.get).not.toHaveBeenCalled();
    expect(result.type).toBe(refreshUser.rejected.type);
    expect(result.meta.condition).toBe(true);
  });

  it("uploads an avatar as FormData", async () => {
    const file = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
    const response = { avatarUrl: "avatar.jpg" };
    api.patch.mockResolvedValueOnce({ data: response });

    const result = await runThunk(updateAvatar(file));
    const [url, formData] = api.patch.mock.calls[0];

    expect(url).toBe("/users/me/avatar");
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("avatar")).toBe(file);
    expect(result.type).toBe(updateAvatar.fulfilled.type);
    expect(result.payload).toEqual(response);
  });

  it("returns a rejected value when the avatar upload fails", async () => {
    api.patch.mockRejectedValueOnce(apiError);

    const result = await runThunk(updateAvatar(new File([], "avatar.jpg")));

    expect(result.type).toBe(updateAvatar.rejected.type);
    expect(result.payload).toBe("Request failed");
  });
});
