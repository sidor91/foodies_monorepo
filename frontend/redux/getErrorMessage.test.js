import { describe, expect, it } from "vitest";

import getErrorMessage from "./getErrorMessage.js";

describe("getErrorMessage", () => {
  it("returns the API error message when it is available", () => {
    const error = { response: { data: { message: "Request failed" } } };

    expect(getErrorMessage(error)).toBe("Request failed");
  });

  it("returns the regular error message when the API message is unavailable", () => {
    const error = { message: "Network error" };

    expect(getErrorMessage(error)).toBe("Network error");
  });

  it("returns the default message when no error message is available", () => {
    expect(getErrorMessage({})).toBe("Something went wrong");
  });
});
