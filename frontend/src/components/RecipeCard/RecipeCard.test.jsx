import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
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

const renderRecipeCard = (props = {}, isLoggedIn = true) =>
  renderWithProviders(<RecipeCard recipe={recipe} {...props} />, {
    preloadedState: { auth: { isLoggedIn } },
  });

describe("RecipeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recipe information and owner links", () => {
    renderRecipeCard();

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
    renderRecipeCard({ recipe: { ...recipe, description: "" } });

    expect(screen.getByText("No description yet.")).toBeInTheDocument();
  });

  it("shows favorite state and passes the recipe id", async () => {
    const user = userEvent.setup();
    const onFavoriteToggle = vi.fn();
    renderRecipeCard({ isFavorite: true, onFavoriteToggle });

    const favoriteButton = screen.getByRole("button", { name: "Remove from favorites" });
    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");

    await user.click(favoriteButton);

    expect(onFavoriteToggle).toHaveBeenCalledWith("recipe-1");
  });

  it("navigates to the recipe page", async () => {
    const user = userEvent.setup();
    renderRecipeCard();

    await user.click(screen.getByRole("button", { name: "Open recipe" }));

    expect(navigateMock).toHaveBeenCalledWith("/recipes/recipe-1");
  });

  it("asks a guest to log in before opening the owner profile", async () => {
    const user = userEvent.setup();
    const onRequireLogin = vi.fn();
    renderRecipeCard({ onRequireLogin }, false);

    await user.click(screen.getByRole("link", { name: "Open Anna profile" }));

    expect(onRequireLogin).toHaveBeenCalledWith("/user/user-1");
  });
});
