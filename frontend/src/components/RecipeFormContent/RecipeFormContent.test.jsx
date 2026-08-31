import { Formik } from "formik";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../test/renderWithProviders.jsx";
import RecipeFormContent from "./RecipeFormContent.jsx";

const { useRecipeFormMock } = vi.hoisted(() => ({
  useRecipeFormMock: vi.fn(),
}));

vi.mock("../../hooks/useRecipeForm.js", () => ({
  default: useRecipeFormMock,
}));

const values = {
  title: "Soup",
  description: "Simple soup",
  category: "category-1",
  time: 10,
  area: "area-1",
  selectedIngredientId: "",
  ingredientQuantity: "",
  ingredients: [
    { ingredientId: "ingredient-1", name: "Tomato", quantity: "2 pcs", img: "tomato.png" },
  ],
  instructions: "Cook everything.",
  photo: null,
};

const referencesState = {
  categories: [{ id: "category-1", name: "Soup" }],
  areas: [{ id: "area-1", name: "Italian" }],
  ingredients: [{ id: "ingredient-1", name: "Tomato", img: "tomato.png" }],
};

const callbacks = {
  handleAddIngredient: vi.fn(),
  handleRemoveIngredient: vi.fn(),
  handleImageUpload: vi.fn(),
  setFieldValue: vi.fn(),
  handleResetForm: vi.fn(),
  saveCurrentDraft: vi.fn(),
};

const renderContent = (isSubmitting = false) => {
  return renderWithProviders(
    <Formik initialValues={values} onSubmit={() => {}}>
      <RecipeFormContent isSubmitting={isSubmitting} />
    </Formik>,
    { preloadedState: { references: referencesState } },
  );
};

describe("RecipeFormContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRecipeFormMock.mockReturnValue({
      ...callbacks,
      previewUrl: null,
      values,
    });
  });

  it("renders the main recipe fields and selected references", () => {
    renderContent();

    expect(screen.getByPlaceholderText("The name of the recipe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter a description of the dish")).toBeInTheDocument();
    expect(screen.getByText("Soup")).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Add the ingredient")).toBeInTheDocument();
    expect(screen.getByText("10 min")).toBeInTheDocument();
  });

  it("renders ingredients from the current form values", () => {
    renderContent();

    expect(screen.getByRole("img", { name: "Tomato" })).toHaveAttribute("src", "tomato.png");
    expect(screen.getByText("2 pcs")).toBeInTheDocument();
  });

  it("calls handleAddIngredient from the add button", async () => {
    const user = userEvent.setup();
    renderContent();

    await user.click(screen.getByRole("button", { name: /add ingredient/i }));

    expect(callbacks.handleAddIngredient).toHaveBeenCalledOnce();
  });

  it("disables reset and publish actions while submitting", () => {
    const { container } = renderContent(true);
    const resetIcon = container.querySelector('use[href="/icons.svg#icon-trash-04"]');
    const resetButton = resetIcon.closest("button");

    expect(resetButton).toBeDisabled();
    expect(screen.getByRole("button", { name: "PUBLISH" })).toBeDisabled();
  });
});
