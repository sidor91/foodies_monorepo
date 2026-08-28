import { describe, expect, it } from "vitest";

import prepareRecipeFormData from "./recipeService.js";

const createRecipeValues = () => ({
  title: "Vegetable Soup",
  description: "A simple homemade soup",
  category: "category-1",
  time: 45,
  area: "area-1",
  instructions: "Cook all ingredients until ready",
  ingredients: [
    {
      ingredientId: "ingredient-1",
      name: "Carrot",
      quantity: "200 g",
    },
  ],
  photo: null,
});

describe("prepareRecipeFormData", () => {
  it("adds the recipe fields and prepares ingredients for the API", () => {
    const formData = prepareRecipeFormData(createRecipeValues());

    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get("title")).toBe("Vegetable Soup");
    expect(formData.get("description")).toBe("A simple homemade soup");
    expect(formData.get("categoryId")).toBe("category-1");
    expect(formData.get("time")).toBe("45");
    expect(formData.get("areaId")).toBe("area-1");
    expect(formData.get("instructions")).toBe("Cook all ingredients until ready");
    expect(JSON.parse(formData.get("ingredients"))).toEqual([
      {
        ingredientId: "ingredient-1",
        measure: "200 g",
      },
    ]);
  });

  it("adds the selected photo as an image", () => {
    const photo = new File(["photo"], "soup.jpg", { type: "image/jpeg" });
    const values = { ...createRecipeValues(), photo };

    const formData = prepareRecipeFormData(values);

    expect(formData.get("image")).toBe(photo);
  });

  it("does not add an image when a photo is not selected", () => {
    const formData = prepareRecipeFormData(createRecipeValues());

    expect(formData.has("image")).toBe(false);
  });
});
