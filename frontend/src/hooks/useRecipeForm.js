import { useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { selectRecipeMetadata } from "../../redux/recipes/recipesSlice";
import { useDispatch } from "react-redux";
import { clearDraft } from "../../redux/recipeDraft/recipeDraftSlice.js";

const useRecipeForm = () => {
  const { values, setFieldValue, errors } = useFormikContext();
  const { ingredientsList } = useSelector(selectRecipeMetadata);
  const dispatch = useDispatch();

  const [currentIngredientId, setCurrentIngredientId] = useState("");
  const [currentIngredientName, setCurrentIngredientName] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

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
    // setCurrentIngredient("");
    // setCurrentQuantity("");
    // console.log("Updated Ingredients after removal:", currentIngredientId);
    setFieldValue("ingredients", updatedIngredients);
  };

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Записуємо новий файл у Formik
      setFieldValue("photo", file);

      // 2. Якщо вже було старе прев'ю, видаляємо його з пам'яті браузера
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // 3. Створюємо нове посилання для прев'ю
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddIngredient = () => {
    if (!currentIngredientId || !currentQuantity) return;
    if (values.ingredients.length >= 30) return;

    // Шукаємо одразу в Redux-списку повний об'єкт інгредієнта за ID
    const selectedItem = ingredientsList.find((item) => item.id === currentIngredientId);

    if (!selectedItem) return;

    const newIngredient = {
      ingredientId: selectedItem.id,
      name: selectedItem.name, // Назва
      quantity: currentQuantity, // Кількість
      img: selectedItem.img,
    };

    // Записуємо у Formik
    setFieldValue("ingredients", [...values.ingredients, newIngredient]);

    // Очищаємо поля
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
  };
};

export default useRecipeForm;
