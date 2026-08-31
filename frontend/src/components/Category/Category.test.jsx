import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Category from "./Category.jsx";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: null,
  fetchAreas: vi.fn(),
  fetchIngredients: vi.fn(),
  fetchRecipes: vi.fn(),
  favoriteToggle: vi.fn(),
  actions: {
    areas: { type: "test/fetchAreas" },
    ingredients: { type: "test/fetchIngredients" },
    recipes: { type: "test/fetchRecipes" },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector(mocks.state),
}));

vi.mock("../../../redux/references/referencesOps.js", () => ({
  fetchAreas: mocks.fetchAreas,
  fetchIngredients: mocks.fetchIngredients,
}));

vi.mock("../../../redux/recipes/recipesOps.js", () => ({
  fetchRecipes: mocks.fetchRecipes,
}));

vi.mock("../../hooks/useFavoriteToggle.js", () => ({
  default: () => mocks.favoriteToggle,
}));

vi.mock("../Dropdown/Dropdown.jsx", () => ({
  default: ({ ariaLabel, onChange, options }) => (
    <button type="button" onClick={() => onChange(options[1]?.id ?? "")}>
      {ariaLabel}
    </button>
  ),
}));

vi.mock("../RecipeCard/RecipeCard.jsx", () => ({
  default: ({ recipe, isFavorite, onFavoriteToggle, onRequireLogin }) => (
    <article>
      <p>{recipe.title}</p>
      <p>Favorite: {String(isFavorite)}</p>
      <button type="button" onClick={() => onFavoriteToggle(recipe.id)}>
        Toggle {recipe.title}
      </button>
      <button type="button" onClick={() => onRequireLogin?.()}>
        Require login for {recipe.title}
      </button>
    </article>
  ),
}));

const category = { id: "dessert", name: "Dessert", description: "Sweet recipes." };

const createState = ({ recipes = [], isLoading = false, error = null, totalPages = 0 } = {}) => ({
  references: {
    areas: [{ id: "italian", name: "Italian" }],
    ingredients: [{ id: "tomato", name: "Tomato" }],
  },
  recipes: {
    list: {
      items: recipes,
      page: 1,
      limit: 12,
      total: recipes.length,
      totalPages,
      isLoading,
      error,
    },
  },
  favorites: { ids: ["recipe-1"] },
  auth: { isLoggedIn: true },
});

const renderCategory = (stateOptions, props = {}) => {
  mocks.state = createState(stateOptions);
  return render(<Category category={category} {...props} />);
};

describe("Category", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchAreas.mockReturnValue(mocks.actions.areas);
    mocks.fetchIngredients.mockReturnValue(mocks.actions.ingredients);
    mocks.fetchRecipes.mockReturnValue(mocks.actions.recipes);
  });

  it("loads references and category recipes on mount", async () => {
    renderCategory();

    expect(mocks.fetchAreas).toHaveBeenCalledOnce();
    expect(mocks.fetchIngredients).toHaveBeenCalledOnce();
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.areas);
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.ingredients);
    await waitFor(() => {
      expect(mocks.fetchRecipes).toHaveBeenCalledWith({
        category: "dessert",
        area: "",
        ingredient: "",
        page: 1,
      });
      expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.recipes);
    });
  });

  it("calls onBack", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderCategory(undefined, { onBack });

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(onBack).toHaveBeenCalledOnce();
  });

  it("uses the default description when the category has none", () => {
    renderCategory(undefined, { category: { id: "dessert", name: "Dessert" } });

    expect(screen.getByText(/go on a taste journey/i)).toBeInTheDocument();
  });

  it("requests recipes for the selected area", async () => {
    const user = userEvent.setup();
    renderCategory();

    await user.click(screen.getByRole("button", { name: "Filter by area" }));

    await waitFor(() => {
      expect(mocks.fetchRecipes).toHaveBeenLastCalledWith({
        category: "dessert",
        area: "italian",
        ingredient: "",
        page: 1,
      });
    });
  });

  it("shows loading state", () => {
    renderCategory({ isLoading: true });

    expect(screen.getByText("Loading recipes...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    renderCategory({ error: "Request failed" });

    expect(screen.getByText("Failed to load recipes.")).toBeInTheDocument();
  });

  it("shows an empty state", () => {
    renderCategory();

    expect(screen.getByText("No recipes found for current filters.")).toBeInTheDocument();
  });

  it("renders recipes with favorite state and handles favorite clicks", async () => {
    const user = userEvent.setup();
    renderCategory({
      recipes: [{ id: "recipe-1", title: "Cake" }],
      totalPages: 1,
    });

    expect(screen.getByText("Cake")).toBeInTheDocument();
    expect(screen.getByText("Favorite: true")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Toggle Cake" }));

    expect(mocks.favoriteToggle).toHaveBeenCalledWith("recipe-1");
  });

  it("passes the login callback to recipe cards", async () => {
    const user = userEvent.setup();
    const onRequireLogin = vi.fn();
    renderCategory(
      {
        recipes: [{ id: "recipe-1", title: "Cake" }],
        totalPages: 1,
      },
      { onRequireLogin },
    );

    await user.click(screen.getByRole("button", { name: "Require login for Cake" }));

    expect(onRequireLogin).toHaveBeenCalledOnce();
  });

  it("requests another page from pagination", async () => {
    const user = userEvent.setup();
    renderCategory({
      recipes: [{ id: "recipe-1", title: "Cake" }],
      totalPages: 2,
    });

    await user.click(screen.getByRole("button", { name: "2" }));

    await waitFor(() => {
      expect(mocks.fetchRecipes).toHaveBeenLastCalledWith({
        category: "dessert",
        area: "",
        ingredient: "",
        page: 2,
      });
    });
  });
});
