import { useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { selectIngredients } from "../../redux/references/referencesSelectors.js";
import { useDispatch } from "react-redux";
import {
  clearDraft,
  updateDraft,
  selectRecipeDraft,
} from "../../redux/recipeFormDraftSlice/recipeFormDraftSlice.js";
const useRecipeForm = () => {
  const { values, setFieldValue, errors } = useFormikContext();
  const ingredientsList = useSelector(selectIngredients);
  const dispatch = useDispatch();

  const [currentIngredientId, setCurrentIngredientId] = useState("");
  const [currentIngredientName, setCurrentIngredientName] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
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
    if (!currentIngredientId || !currentQuantity) return;
    if (values.ingredients.length >= 30) return;

    // Find the selected ingredient from the ingredientsList using the currentIngredientId
    const selectedItem = ingredientsList.find((item) => item.id === currentIngredientId);

    if (!selectedItem) return;

    const newIngredient = {
      ingredientId: selectedItem.id,
      name: selectedItem.name,
      quantity: currentQuantity,
      img: selectedItem.img,
    };

    // Set the new ingredient in Formik's state
    setFieldValue("ingredients", [...values.ingredients, newIngredient]);

    dispatch(updateDraft({ ...values, ingredients: [...values.ingredients, newIngredient] }));

    // Clear the fields
    setCurrentIngredientId("");
    setCurrentQuantity("");
  };

  return {
    values,
    errors,
    setFieldValue,
    currentIngredientId,
    setCurrentIngredientId,
    currentIngredientName,
    setCurrentIngredientName,
    currentQuantity,
    setCurrentQuantity,
    handleAddIngredient,
    handleRemoveIngredient,
    handleImageUpload,
    previewUrl,
    handleResetForm,
    saveCurrentDraft,
  };
};

export default useRecipeForm;
