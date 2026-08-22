/* eslint-disable no-console */
/* eslint-disable no-undef */

const prepareRecipeFormData = (values) => {
  const formData = new FormData();
  if (values.photo) formData.append("photo", values.photo);
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("category", values.category);
  formData.append("time", values.time);
  formData.append("area", values.area);
  formData.append("instructions", values.instructions);
  formData.append("ingredients", JSON.stringify(values.ingredients));
  return formData;
};

export default prepareRecipeFormData;
