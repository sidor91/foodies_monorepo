import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Dropdown from "./Dropdown.jsx";

const options = [
  { id: "italian", name: "Italian" },
  { id: "ukrainian", name: "Ukrainian" },
];

describe("Dropdown", () => {
  it("renders its label and placeholder", () => {
    render(
      <Dropdown label="Area" value="" onChange={() => {}} options={options} placeholder="Choose" />,
    );

    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Area" })).toHaveTextContent("Choose");
  });

  it("uses ariaLabel when a visible label is not provided", () => {
    render(<Dropdown ariaLabel="Filter by area" value="" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: "Filter by area" })).toBeInTheDocument();
  });

  it("shows options and returns the selected id", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown ariaLabel="Area" value="" onChange={onChange} options={options} />);

    await user.click(screen.getByRole("button", { name: "Area" }));
    await user.click(screen.getByRole("option", { name: "Italian" }));

    expect(onChange).toHaveBeenCalledWith("italian");
  });

  it("shows an empty state when there are no options", async () => {
    const user = userEvent.setup();
    render(<Dropdown ariaLabel="Area" value="" onChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Area" }));

    expect(screen.getByText("No options")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Dropdown ariaLabel="Area" value="" onChange={() => {}} disabled />);

    expect(screen.getByRole("button", { name: "Area" })).toBeDisabled();
  });

  it("calls onBlur when focus leaves the button", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Dropdown ariaLabel="Area" value="" onChange={() => {}} onBlur={onBlur} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Area" })).toHaveFocus();
    await user.tab();

    expect(onBlur).toHaveBeenCalled();
  });
});
