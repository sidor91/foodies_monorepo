import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import IngredientList from "./IngredientList.jsx";

const ingredients = [
  { name: "Tomato", quantity: "2 pcs", img: "tomato.png" },
  { name: "Salt", quantity: "1 tsp", img: "" },
];

describe("IngredientList", () => {
  it("renders ingredient names and quantities", () => {
    render(<IngredientList ingredients={ingredients} onRemove={() => {}} />);

    expect(screen.getByText("Tomato")).toBeInTheDocument();
    expect(screen.getByText("2 pcs")).toBeInTheDocument();
    expect(screen.getByText("Salt")).toBeInTheDocument();
    expect(screen.getByText("1 tsp")).toBeInTheDocument();
  });

  it("renders an image only when the ingredient has one", () => {
    render(<IngredientList ingredients={ingredients} onRemove={() => {}} />);

    expect(screen.getByRole("img", { name: "Tomato" })).toHaveAttribute("src", "tomato.png");
    expect(screen.queryByRole("img", { name: "Salt" })).not.toBeInTheDocument();
  });

  it("passes the ingredient index to onRemove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<IngredientList ingredients={ingredients} onRemove={onRemove} />);

    const saltItem = screen.getByText("Salt").closest("li");
    await user.click(within(saltItem).getByRole("button"));

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
