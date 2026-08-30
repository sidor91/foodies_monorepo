const prepareRecipeFormData = (values) => {
  const formData = new FormData();

  if (values.photo) formData.append("image", values.photo);
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("categoryId", values.category);
  formData.append("time", values.time);
  formData.append("areaId", values.area);
  formData.append("instructions", values.instructions);

  const cleanedIngredients = values.ingredients.map((item) => ({
    ingredientId: item.ingredientId,
    measure: item.quantity,
  }));

  formData.append("ingredients", JSON.stringify(cleanedIngredients));
  return formData;
};

export default prepareRecipeFormData;
