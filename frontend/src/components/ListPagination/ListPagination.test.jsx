import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ListPagination from "./ListPagination.jsx";

describe("ListPagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <ListPagination page={1} totalPages={1} onPageChange={() => {}} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the visible page buttons", () => {
    render(<ListPagination page={1} totalPages={5} onPageChange={() => {}} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.textContent)).toEqual(["1", "2", "3"]);
  });

  it("marks the current page and disables its button", () => {
    render(<ListPagination page={2} totalPages={5} onPageChange={() => {}} />);

    const currentPage = screen.getByRole("button", { name: "Go to page 2" });

    expect(currentPage).toBeDisabled();
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange with the selected page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<ListPagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(onPageChange).toHaveBeenCalledOnce();
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
