import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SocialLinks from "./SocialLinks.jsx";

describe("SocialLinks", () => {
  it("renders all social links", () => {
    render(<SocialLinks />);

    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Youtube" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
  });

  it("uses the correct addresses and opens links safely", () => {
    render(<SocialLinks />);

    const expectedLinks = [
      { name: "Facebook", href: "https://www.facebook.com/goITclub/" },
      { name: "Youtube", href: "https://www.youtube.com/c/GoIT" },
      { name: "Instagram", href: "https://www.instagram.com/goitclub/" },
    ];

    expectedLinks.forEach(({ name, href }) => {
      const link = screen.getByRole("link", { name });

      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
