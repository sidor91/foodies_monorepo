import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Testimonials from "./Testimonials.jsx";

const mocks = vi.hoisted(() => ({
  fetchTestimonialsMock: vi.fn(),
  dispatch: vi.fn(),
  references: { testimonials: [], isLoading: false },
  action: { type: "test/fetchTestimonials" },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector({ references: mocks.references }),
}));

vi.mock("../../../redux/references/referencesOps.js", () => ({
  fetchTestimonials: mocks.fetchTestimonialsMock,
}));

const renderTestimonials = (testimonials = [], isLoading = false) => {
  mocks.references = { testimonials, isLoading };
  return render(<Testimonials />);
};

describe("Testimonials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchTestimonialsMock.mockReturnValue(mocks.action);
  });

  it("dispatches testimonial loading on mount", () => {
    renderTestimonials();

    expect(mocks.fetchTestimonialsMock).toHaveBeenCalledOnce();
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.action);
  });

  it("shows loading while the empty list is loading", () => {
    renderTestimonials([], true);

    expect(screen.getByText("Loading testimonials...")).toBeInTheDocument();
  });

  it("renders nothing for an empty loaded list", () => {
    const { container } = renderTestimonials();

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a testimonial and its author", () => {
    renderTestimonials([
      { id: "testimonial-1", testimonial: "Great recipes!", owner: { name: "Anna" } },
    ]);

    expect(screen.getByText("Great recipes!")).toBeInTheDocument();
    expect(screen.getByText("Anna")).toBeInTheDocument();
  });

  it("uses a fallback author and switches testimonials", async () => {
    const user = userEvent.setup();
    renderTestimonials([
      { id: "testimonial-1", testimonial: "First", owner: { name: "Anna" } },
      { id: "testimonial-2", testimonial: "Second" },
    ]);

    await user.click(screen.getByRole("button", { name: "Show testimonial 2" }));

    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Foodies customer")).toBeInTheDocument();
  });
});
