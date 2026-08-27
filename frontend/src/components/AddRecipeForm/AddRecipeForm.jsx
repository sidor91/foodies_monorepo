import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRecipeDraft,
  clearDraft,
} from "../../../redux/recipeFormDraftSlice/recipeFormDraftSlice.js";
import {
  fetchCategories,
  fetchAreas,
  fetchIngredients,
} from "../../../redux/references/referencesOps.js";
import prepareRecipeFormData from "../../services/recipeService.js";
import { addRecipe } from "../../../redux/recipes/recipesOps.js";
import RecipeFormContent from "../RecipeFormContent/RecipeFormContent.jsx";
import { toast } from "react-hot-toast";

// 1. Схема валідації Yup
const RecipeSchema = Yup.object().shape({
  photo: Yup.mixed().optional().notRequired(),
  title: Yup.string().required("Title is required").max(100, "Max 100 characters"),
  description: Yup.string().max(200, "Max 200 characters").required("Description is required"),
  category: Yup.string().required("Category is required"),
  time: Yup.number().min(1, "Time must be at least 1 min").required("Required"),
  area: Yup.string().required("Area is required"),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        quantity: Yup.string().required(),
        ingredientId: Yup.string().required("Ingredient is required"),
        name: Yup.string(),
        img: Yup.string(),
      }),
    )
    .min(1, "Please add at least one ingredient")
    .max(30, "You can add up to 30 ingredients only"),
  instructions: Yup.string()
    .max(1000, "Max 1000 characters")
    .required("Preparation steps are required"),
});

const AddRecipeForm = () => {
  const savedDraft = useSelector(selectRecipeDraft);
  const dispatch = useDispatch();

  const initialValues = {
    photo: savedDraft?.photo || null,
    title: savedDraft?.title || "",
    description: savedDraft?.description || "",
    category: savedDraft?.category || "",
    time: savedDraft?.time || 10,
    area: savedDraft?.area || "",
    ingredients: savedDraft?.ingredients || [],
    instructions: savedDraft?.instructions || "",
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  // heandleSubmit function to handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = prepareRecipeFormData(values);
    try {
      await dispatch(addRecipe(formData)).unwrap();
      toast.success("Successfully created a recipe!");

      dispatch(clearDraft()); // clear the draft in Redux
      resetForm(); // clear Formik form

      // redirect to another page
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <Formik initialValues={initialValues} validationSchema={RecipeSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => <RecipeFormContent isSubmitting={isSubmitting} />}
      </Formik>
    </section>
  );
};

export default AddRecipeForm;
