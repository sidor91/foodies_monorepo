import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../test/renderWithProviders.jsx";
import RecipeCard from "./RecipeCard.jsx";

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

const recipe = {
  id: "recipe-1",
  title: "Tomato soup",
  description: "A simple soup.",
  image: "soup.jpg",
  owner: { id: "user-1", name: "Anna", avatarUrl: "anna.jpg" },
};

describe("RecipeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recipe information and owner links", () => {
    renderWithRouter(<RecipeCard recipe={recipe} />);

    expect(screen.getByRole("heading", { name: "Tomato soup" })).toBeInTheDocument();
    expect(screen.getByText("A simple soup.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Anna profile" })).toHaveAttribute(
      "href",
      "/user/user-1",
    );
    expect(screen.getByRole("link", { name: "Anna" })).toHaveAttribute(
      "href",
      "/user/user-1",
    );
  });

  it("renders a fallback description", () => {
    renderWithRouter(<RecipeCard recipe={{ ...recipe, description: "" }} />);

    expect(screen.getByText("No description yet.")).toBeInTheDocument();
  });

  it("shows favorite state and passes the recipe id", async () => {
    const user = userEvent.setup();
    const onFavoriteToggle = vi.fn();
    renderWithRouter(
      <RecipeCard recipe={recipe} isFavorite onFavoriteToggle={onFavoriteToggle} />,
    );

    const favoriteButton = screen.getByRole("button", { name: "Remove from favorites" });
    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");

    await user.click(favoriteButton);

    expect(onFavoriteToggle).toHaveBeenCalledWith("recipe-1");
  });

  it("navigates to the recipe page", async () => {
    const user = userEvent.setup();
    renderWithRouter(<RecipeCard recipe={recipe} />);

    await user.click(screen.getByRole("button", { name: "Open recipe" }));

    expect(navigateMock).toHaveBeenCalledWith("/recipes/recipe-1");
  });
});
