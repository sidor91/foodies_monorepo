import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ImageWithFallback from "./ImageWithFallback.jsx";

describe("ImageWithFallback", () => {
  it("shows a placeholder while the image is loading", () => {
    render(<ImageWithFallback src="dish.jpg" alt="Soup" />);

    expect(screen.getByRole("img", { name: "Soup" })).toBeInTheDocument();
    expect(screen.queryByAltText("Soup", { selector: "img" })).not.toBeInTheDocument();
  });

  it("shows the image after it loads", () => {
    const { container } = render(<ImageWithFallback src="dish.jpg" alt="Soup" />);

    fireEvent.load(container.querySelector('img[src="dish.jpg"]'));

    expect(screen.getByRole("img", { name: "Soup" })).toHaveAttribute("src", "dish.jpg");
  });

  it("returns to the fallback when the loaded image fails", () => {
    const { container } = render(<ImageWithFallback src="dish.jpg" alt="Soup" />);
    fireEvent.load(container.querySelector('img[src="dish.jpg"]'));

    fireEvent.error(screen.getByRole("img", { name: "Soup" }));

    expect(screen.queryByAltText("Soup", { selector: "img" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Soup" })).toBeInTheDocument();
  });

  it("shows a fallback immediately when src is missing", () => {
    render(<ImageWithFallback alt="Missing image" />);

    expect(screen.getByRole("img", { name: "Missing image" })).toBeInTheDocument();
  });

  it("shows the avatar icon for an avatar placeholder", () => {
    const { container } = render(
      <ImageWithFallback alt="User avatar" placeholder="avatar" />,
    );

    expect(screen.getByRole("img", { name: "User avatar" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
