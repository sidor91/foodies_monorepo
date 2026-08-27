import { useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { selectIngredients } from "../../redux/references/referencesSelectors.js";
import { useDispatch } from "react-redux";
import { clearDraft, updateDraft } from "../../redux/recipeFormDraftSlice/recipeFormDraftSlice.js";
import { toast } from "react-hot-toast";

const useRecipeForm = () => {
  const { values, setFieldValue, errors } = useFormikContext();
  const ingredientsList = useSelector(selectIngredients);
  const dispatch = useDispatch();
  const [previewUrl, setPreviewUrl] = useState(null);

  const saveCurrentDraft = () => {
    dispatch(updateDraft(values));
  };

  const handleResetForm = (resetForm) => {
    dispatch(clearDraft());
    setPreviewUrl(null);
    if (resetForm) {
      resetForm();
    }
  };

  // function to remove an ingredient from the list by its index
  const handleRemoveIngredient = (indexToRemove) => {
    const updatedIngredients = values.ingredients.filter((_, index) => index !== indexToRemove);
    setFieldValue("ingredients", updatedIngredients);
    dispatch(updateDraft({ ...values, ingredients: updatedIngredients }));
  };

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Set the file in Formik's state
      setFieldValue("photo", file);

      // 2. If there was a previous preview, revoke it from the browser's memory
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // 3. Create a new preview URL
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddIngredient = () => {
    const { selectedIngredientId, ingredientQuantity, ingredients } = values;

    if (!selectedIngredientId || !ingredientQuantity) return;
    if (ingredients.length >= 30) {
      toast.error("You can add up to 30 ingredients only.");
      return;
    }

    // find the selected ingredient in the ingredientsList
    const selectedItem = ingredientsList.find((item) => item.id === selectedIngredientId);
    if (!selectedItem) return;

    const newIngredient = {
      ingredientId: selectedItem.id,
      name: selectedItem.name,
      quantity: ingredientQuantity,
      img: selectedItem.img,
    };

    // Check if the ingredient already exists in the list
    const updatedIngredients = [...ingredients, newIngredient];

    // update Formik's state with the new ingredients list and reset the selected ingredient and quantity
    setFieldValue("ingredients", updatedIngredients);
    setFieldValue("selectedIngredientId", "");
    setFieldValue("ingredientQuantity", "");

    // save the updated draft to Redux
    dispatch(
      updateDraft({
        ...values,
        ingredients: updatedIngredients,
        selectedIngredientId: "",
        ingredientQuantity: "",
      }),
    );
  };

  return {
    values,
    errors,
    setFieldValue,
    handleAddIngredient,
    handleRemoveIngredient,
    handleImageUpload,
    previewUrl,
    handleResetForm,
    saveCurrentDraft,
  };
};

export default useRecipeForm;
