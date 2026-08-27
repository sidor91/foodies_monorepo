import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SectionContainer from "./SectionContainer.jsx";

describe("SectionContainer", () => {
  it("renders its children", () => {
    render(
      <SectionContainer>
        <p>Section content</p>
      </SectionContainer>,
    );

    expect(screen.getByText("Section content")).toBeInTheDocument();
  });
});
