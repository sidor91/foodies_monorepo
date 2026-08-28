import { beforeEach, describe, expect, it, vi } from "vitest";

import api from "../../src/api/axios.js";
import {
  fetchFollowers,
  fetchFollowing,
  fetchUserById,
  followUser,
  unfollowUser,
} from "./usersOps.js";

vi.mock("../../src/api/axios.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const runThunk = (thunk) => thunk(vi.fn(), () => ({}), undefined);
const apiError = { response: { data: { message: "Request failed" } } };

describe("usersOps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a user profile by ID", async () => {
    const user = { id: "user-1" };
    api.get.mockResolvedValueOnce({ data: user });

    const result = await runThunk(fetchUserById("user-1"));

    expect(api.get).toHaveBeenCalledWith("/users/user-1");
    expect(result.type).toBe(fetchUserById.fulfilled.type);
    expect(result.payload).toEqual(user);
  });

  it("returns a rejected value when fetching a user profile fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchUserById("user-1"));

    expect(result.type).toBe(fetchUserById.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches a user's followers with pagination parameters", async () => {
    const payload = { items: [{ id: "user-2" }] };
    api.get.mockResolvedValueOnce({ data: payload });

    const result = await runThunk(fetchFollowers({ userId: "user-1", page: 2, limit: 6 }));

    expect(api.get).toHaveBeenCalledWith("/users/user-1/followers", {
      params: { page: 2, limit: 6 },
    });
    expect(result.type).toBe(fetchFollowers.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("returns a rejected value when fetching followers fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchFollowers({ userId: "user-1" }));

    expect(result.type).toBe(fetchFollowers.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("fetches followed users with pagination parameters", async () => {
    const payload = { items: [{ id: "user-2" }] };
    api.get.mockResolvedValueOnce({ data: payload });

    const result = await runThunk(fetchFollowing({ page: 2, limit: 6 }));

    expect(api.get).toHaveBeenCalledWith("/users/following", {
      params: { page: 2, limit: 6 },
    });
    expect(result.type).toBe(fetchFollowing.fulfilled.type);
    expect(result.payload).toEqual(payload);
  });

  it("returns a rejected value when fetching followed users fails", async () => {
    api.get.mockRejectedValueOnce(apiError);

    const result = await runThunk(fetchFollowing({}));

    expect(result.type).toBe(fetchFollowing.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("follows a user and returns their ID", async () => {
    api.post.mockResolvedValueOnce({});

    const result = await runThunk(followUser("user-1"));

    expect(api.post).toHaveBeenCalledWith("/users/user-1/follow");
    expect(result.type).toBe(followUser.fulfilled.type);
    expect(result.payload).toBe("user-1");
  });

  it("returns a rejected value when following a user fails", async () => {
    api.post.mockRejectedValueOnce(apiError);

    const result = await runThunk(followUser("user-1"));

    expect(result.type).toBe(followUser.rejected.type);
    expect(result.payload).toBe("Request failed");
  });

  it("unfollows a user and returns their ID", async () => {
    api.delete.mockResolvedValueOnce({});

    const result = await runThunk(unfollowUser("user-1"));

    expect(api.delete).toHaveBeenCalledWith("/users/user-1/follow");
    expect(result.type).toBe(unfollowUser.fulfilled.type);
    expect(result.payload).toBe("user-1");
  });

  it("returns a rejected value when unfollowing a user fails", async () => {
    api.delete.mockRejectedValueOnce(apiError);

    const result = await runThunk(unfollowUser("user-1"));

    expect(result.type).toBe(unfollowUser.rejected.type);
    expect(result.payload).toBe("Request failed");
  });
});
