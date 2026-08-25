import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import css from "./AddRecipeForm.module.css";
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

// 1. schema for form validation using Yup
const RecipeSchema = Yup.object().shape({
  photo: Yup.mixed().optional().notRequired(),
  title: Yup.string().required("Title is required").max(100, "Max 100 characters"),
  description: Yup.string().max(200, "Max 200 characters"),
  category: Yup.string().required("Category is required"),
  time: Yup.number().min(1, "Time must be at least 1 min"),
  area: Yup.string().required("Area is required"),
  selectedIngredientId: Yup.string(),
  ingredientQuantity: Yup.string(),
  ingredients: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.string(),
      ingredientId: Yup.string(),
      name: Yup.string(),
      img: Yup.string(),
    }),
  ),
  instructions: Yup.string().max(1000, "Max 1000 characters").required("Instructions are required"),
});

const AddRecipeForm = () => {
  const savedDraft = useSelector(selectRecipeDraft);
  const dispatch = useDispatch();

  const initialValues = {
    title: savedDraft?.title || "",
    description: savedDraft?.description || "",
    category: savedDraft?.category || "",
    time: savedDraft?.time || 10,
    area: savedDraft?.area || "",
    ingredients: structuredClone(savedDraft?.ingredients) || [],
    instructions: savedDraft?.instructions || "",
    selectedIngredientId: savedDraft?.selectedIngredientId || "",
    ingredientQuantity: savedDraft?.ingredientQuantity || "",
    photo: null,
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
      resetForm(); // reset the form fields

      // redirect to another page    TODO
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={css.header__section}>
      <div className={css.header__container}>
        <Formik
          initialValues={initialValues}
          validationSchema={RecipeSchema}
          onSubmit={handleSubmit}
          // enableReinitialize={true}
        >
          {({ isSubmitting }) => <RecipeFormContent isSubmitting={isSubmitting} />}
        </Formik>
      </div>
    </section>
  );
};

export default AddRecipeForm;
