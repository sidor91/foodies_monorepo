import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ListItems from "./ListItems.jsx";

vi.mock("../RecipePreview/RecipePreview.jsx", () => ({
  default: ({ recipe, isDeleting, isDeleteBlocked, onDelete }) => (
    <button type="button" disabled={isDeleteBlocked} onClick={() => onDelete(recipe.id)}>
      {isDeleting ? `Deleting ${recipe.title}` : `Recipe ${recipe.title}`}
    </button>
  ),
}));

vi.mock("../UserCard/UserCard.jsx", () => ({
  default: ({ user }) => <article>User {user.name}</article>,
}));

describe("ListItems", () => {
  it("shows the correct empty message for an own profile tab", () => {
    render(
      <ListItems
        items={[]}
        activeTab="favorites"
        isOwnProfile
        deletingRecipeId={null}
        onDelete={() => {}}
      />,
    );

    expect(
      screen.getByText(/Nothing has been added to your favorite recipes list yet/i),
    ).toBeInTheDocument();
  });

  it("shows the correct empty message for another profile", () => {
    render(
      <ListItems
        items={[]}
        activeTab="recipes"
        isOwnProfile={false}
        deletingRecipeId={null}
        onDelete={() => {}}
      />,
    );

    expect(screen.getByText("This user has not added any recipes yet.")).toBeInTheDocument();
  });

  it("renders recipe items and forwards their deleting state", () => {
    const recipes = [
      { id: "recipe-1", title: "Soup" },
      { id: "recipe-2", title: "Salad" },
    ];

    render(
      <ListItems
        items={recipes}
        activeTab="recipes"
        isOwnProfile
        deletingRecipeId="recipe-1"
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Deleting Soup" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Recipe Salad" })).toBeDisabled();
  });

  it("renders user items for followers", () => {
    const users = [
      { id: "user-1", name: "Anna" },
      { id: "user-2", name: "Mark" },
    ];

    render(
      <ListItems
        items={users}
        activeTab="followers"
        isOwnProfile
        deletingRecipeId={null}
        onDelete={() => {}}
      />,
    );

    expect(screen.getByText("User Anna")).toBeInTheDocument();
    expect(screen.getByText("User Mark")).toBeInTheDocument();
  });

  it("renders nothing for an unknown tab", () => {
    const { container } = render(
      <ListItems
        items={[{ id: "item-1" }]}
        activeTab="unknown"
        isOwnProfile
        deletingRecipeId={null}
        onDelete={() => {}}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
