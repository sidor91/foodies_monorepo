import { useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { selectRecipeMetadata } from "../../redux/recipes/recipesSlice";

const useRecipeForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const { ingredientsList } = useSelector(selectRecipeMetadata);

  const [currentIngredientId, setCurrentIngredientId] = useState("");
  const [currentIngredientName, setCurrentIngredientName] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // Функція для видалення інгредієнта зі списку
  const handleRemoveIngredient = (indexToRemove) => {
    const updatedIngredients = values.ingredients.filter((_, index) => index !== indexToRemove);
    // setCurrentIngredient("");
    // setCurrentQuantity("");
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
      ingredient: selectedItem.id,
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
  };
};

export default useRecipeForm;
