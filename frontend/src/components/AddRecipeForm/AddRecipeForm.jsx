/* eslint-disable no-console */
/* eslint-disable no-undef */
import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import css from "./AddRecipeForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selectRecipeDraft, clearDraft } from "../../../redux/recipeDraft/recipeDraftSlice.js";
import {
  fetchCategories,
  fetchAreas,
  fetchIngredients,
} from "../../../redux/references/referencesOps.js";
import prepareRecipeFormData from "../../services/recipeService.js";
import { addRecipe } from "../../../redux/recipes/recipesOps.js";
import RecipeFormContent from "../RecipeFormContent/RecipeFormContent.jsx";

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
  const initialValues = useSelector(selectRecipeDraft);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  // heandleSubmit function to handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = prepareRecipeFormData(values);
    try {
      const result = await dispatch(addRecipe(formData)).unwrap();
      alert("Successfully created: " + JSON.stringify(result));

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
    <section className={clsx("section")}>
      <div className={clsx("container")}>
        <Formik
          initialValues={initialValues}
          validationSchema={RecipeSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => <RecipeFormContent isSubmitting={isSubmitting} />}
        </Formik>
      </div>
    </section>
  );
};

export default AddRecipeForm;
