import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import RecipePreview from "./RecipePreview.jsx";

const recipe = {
  id: "recipe-1",
  title: "Tomato soup",
  description: "A simple tomato soup.",
  image: "soup.jpg",
};

const renderRecipe = (props = {}) => {
  return renderWithRouter(
    <RecipePreview
      recipe={recipe}
      activeTab="recipes"
      isOwnProfile={false}
      isDeleting={false}
      isDeleteBlocked={false}
      onDelete={() => {}}
      {...props}
    />,
  );
};

describe("RecipePreview", () => {
  it("renders the recipe information and details link", () => {
    renderRecipe();

    expect(screen.getByRole("heading", { name: "Tomato soup" })).toBeInTheDocument();
    expect(screen.getByText("A simple tomato soup.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Tomato soup" })).toHaveAttribute("src", "soup.jpg");
    expect(screen.getByRole("link", { name: "Open Tomato soup" })).toHaveAttribute(
      "href",
      "/recipe/recipe-1",
    );
  });

  it("renders fallback content when image and description are missing", () => {
    renderRecipe({ recipe: { id: "recipe-2", title: "Salad" } });

    expect(screen.getByRole("img", { name: "Salad image is not available" })).toBeInTheDocument();
    expect(screen.getByText("No description available.")).toBeInTheDocument();
  });

  it("does not show a delete button on another user's profile", () => {
    renderRecipe();

    expect(screen.queryByRole("button", { name: "Delete recipe" })).not.toBeInTheDocument();
  });

  it("passes the recipe id to onDelete", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderRecipe({ isOwnProfile: true, onDelete });

    await user.click(screen.getByRole("button", { name: "Delete recipe" }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith("recipe-1");
  });

  it("shows a disabled pending button while deleting a favorite", () => {
    renderRecipe({
      activeTab: "favorites",
      isOwnProfile: true,
      isDeleting: true,
      isDeleteBlocked: true,
    });

    expect(screen.getByRole("button", { name: "Removing from favorites" })).toBeDisabled();
  });
});
