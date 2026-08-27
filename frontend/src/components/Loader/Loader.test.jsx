import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Loader from "./Loader.jsx";

vi.mock("react-loader-spinner", () => ({
  ThreeDots: ({ ariaLabel }) => <div role="status" aria-label={ariaLabel} />,
}));

describe("Loader", () => {
  it("renders an accessible loading indicator", () => {
    render(<Loader />);

    expect(screen.getByLabelText("three-dots-loading")).toBeInTheDocument();
  });
});
