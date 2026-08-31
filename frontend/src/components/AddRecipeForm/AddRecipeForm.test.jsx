import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AddRecipeForm from "./AddRecipeForm.jsx";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  fetchCategories: vi.fn(),
  fetchAreas: vi.fn(),
  fetchIngredients: vi.fn(),
  addRecipe: vi.fn(),
  addRecipeUnwrap: vi.fn(),
  prepareRecipeFormData: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  draft: null,
  actions: {
    categories: { type: "test/fetchCategories" },
    areas: { type: "test/fetchAreas" },
    ingredients: { type: "test/fetchIngredients" },
    addRecipe: { type: "test/addRecipe" },
  },
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: () => mocks.draft,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("../../../redux/references/referencesOps.js", () => ({
  fetchCategories: mocks.fetchCategories,
  fetchAreas: mocks.fetchAreas,
  fetchIngredients: mocks.fetchIngredients,
}));

vi.mock("../../../redux/recipes/recipesOps.js", () => ({
  addRecipe: mocks.addRecipe,
}));

vi.mock("../../services/recipeService.js", () => ({
  default: mocks.prepareRecipeFormData,
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  },
}));

vi.mock("../RecipeFormContent/RecipeFormContent.jsx", async () => {
  const { useFormikContext } = await import("formik");

  const MockRecipeFormContent = () => {
    const { errors, values, submitForm } = useFormikContext();

    return (
      <div>
        <p>Draft title: {values.title}</p>
        {typeof errors.ingredients === "string" && <p>{errors.ingredients}</p>}
        <button type="button" onClick={submitForm}>
          Submit recipe
        </button>
      </div>
    );
  };

  return {
    default: MockRecipeFormContent,
  };
});

const validDraft = {
  title: "Tomato soup",
  description: "Simple soup",
  category: "category-1",
  time: 20,
  area: "area-1",
  ingredients: [
    { ingredientId: "ingredient-1", name: "Tomato", quantity: "2 pcs", img: "tomato.png" },
  ],
  instructions: "Cook everything.",
  selectedIngredientId: "",
  ingredientQuantity: "",
};

describe("AddRecipeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.draft = structuredClone(validDraft);
    mocks.fetchCategories.mockReturnValue(mocks.actions.categories);
    mocks.fetchAreas.mockReturnValue(mocks.actions.areas);
    mocks.fetchIngredients.mockReturnValue(mocks.actions.ingredients);
    mocks.addRecipe.mockReturnValue(mocks.actions.addRecipe);
    mocks.addRecipeUnwrap.mockResolvedValue({ id: "new-recipe" });
    mocks.prepareRecipeFormData.mockReturnValue({ prepared: true });
    mocks.dispatch.mockImplementation((action) => {
      if (action === mocks.actions.addRecipe) {
        return { unwrap: mocks.addRecipeUnwrap };
      }

      return action;
    });
  });

  it("loads recipe references when mounted", () => {
    render(<AddRecipeForm />);

    expect(mocks.fetchCategories).toHaveBeenCalledOnce();
    expect(mocks.fetchAreas).toHaveBeenCalledOnce();
    expect(mocks.fetchIngredients).toHaveBeenCalledOnce();
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.categories);
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.areas);
    expect(mocks.dispatch).toHaveBeenCalledWith(mocks.actions.ingredients);
  });

  it("uses the saved Redux draft as initial form values", () => {
    render(<AddRecipeForm />);

    expect(screen.getByText("Draft title: Tomato soup")).toBeInTheDocument();
  });

  it("does not add a recipe without ingredients", async () => {
    const user = userEvent.setup();
    mocks.draft = { ...validDraft, ingredients: [] };

    render(<AddRecipeForm />);
    await user.click(screen.getByRole("button", { name: "Submit recipe" }));

    expect(await screen.findByText("Please add at least one ingredient")).toBeInTheDocument();
    expect(mocks.addRecipe).not.toHaveBeenCalled();
  });

  it("adds a valid recipe and navigates to its page", async () => {
    const user = userEvent.setup();

    render(<AddRecipeForm />);
    await user.click(screen.getByRole("button", { name: "Submit recipe" }));

    await waitFor(() => {
      expect(mocks.addRecipe).toHaveBeenCalledWith({ prepared: true });
    });
    expect(mocks.addRecipeUnwrap).toHaveBeenCalledOnce();
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Successfully created a recipe!");
    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "recipeDraft/clearDraft" }),
    );
    expect(mocks.navigate).toHaveBeenCalledWith("/recipes/new-recipe");
  });
});
