import { Form, Field, ErrorMessage, useFormikContext } from "formik";
import { useSelector } from "react-redux";
import useRecipeForm from "../../hooks/useRecipeForm.js";
import IngredientList from "../IngredientList/IngredientList.jsx";
import {
  selectCategories,
  selectAreas,
  selectIngredients,
  // selectReferencesError,
  // selectReferencesIsLoading,
} from "../../../redux/references/referencesSelectors.js";
import CustomSelect from "../CustomSelect/CustomSelect.jsx";
import Icon from "../Icon/Icon.jsx";
import clsx from "clsx";

const RecipeFormContent = ({ isSubmitting }) => {
  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const ingredientsList = useSelector(selectIngredients);
  // const error = useSelector(selectReferencesError);
  // const loading = useSelector(selectReferencesIsLoading);

  const { resetForm } = useFormikContext();

  const {
    handleAddIngredient,
    handleRemoveIngredient,
    handleImageUpload,
    previewUrl,
    values,
    setFieldValue,
    handleResetForm,
    errors,
    saveCurrentDraft,
  } = useRecipeForm();

  return (
    <Form onBlur={saveCurrentDraft}>
      <div>
        <div className="max-w-[34.3rem] h-[31.8rem] rounded-[3rem] border border-dashed border-(--gray) overflow-hidden mb-[3.2rem]">
          <label className="pointer-events-auto max-w-[34.4rem] h-full cursor-pointer flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Recipe preview" className="w-full h-full object-cover" />
            ) : (
              <div className="mx-auto flex flex-col items-center justify-center my-[12rem] gap-[0.8rem] ">
                <Icon name="add-image" size={50} className="fill-(--black)/20" />
                <span className="text-[1.4rem] block leading-[143%] underline text-(--black)">
                  Upload a photo
                </span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, setFieldValue)}
            />
          </label>
        </div>
      </div>
      <div>
        {/* title and description */}
        <label className="mb-[3.2rem] block">
          <Field
            name="title"
            type="text"
            placeholder="The name of the recipe"
            className="font-extrabold text-[1.8rem] leading-[133%] uppercase text-(--gray)"
          />
          <FormError name="title" />
        </label>

        <label className="mb-[3.2rem] block">
          <CustomTextarea name="description" placeholder="Enter a description of the dish" />
          <FormError name="description" />
        </label>
        <div className="flex flex-col gap-[2rem] mb-[32px]">
          {/* category and time */}
          <div className="flex flex-col w-full gap-[2rem]">
            <div className="flex flex-col">
              <CustomSelect
                name="category"
                placeholder="Select category"
                options={categories}
                value={values.category}
                label="CATEGORY"
              />
            </div>

            <div className="flex flex-col gap-[0.8rem]">
              <label className="uppercase font-extrabold leading-[150%]">COOKING TIME</label>
              <div className="flex items-center gap-[1.2rem]">
                <button
                  type="button"
                  className="border rounded-[50%] flex justify-center items-center p-[1.6rem] border-(--grey)"
                  onClick={() => setFieldValue("time", Math.max(1, values.time - 5))}
                >
                  <Icon name="minus" size={16} className="stroke-(--black)" />
                </button>
                <span className="font-medium text-[1.4rem] leading-[143%] text-(--grey)">
                  {values.time} min
                </span>
                <button
                  type="button"
                  className="border rounded-[50%] flex justify-center items-center p-[1.6rem]  border-(--grey)"
                  onClick={() => setFieldValue("time", values.time + 5)}
                >
                  <Icon name="plus" size={16} className="stroke-(--black)" />
                </button>
              </div>
            </div>
          </div>
          {/* area */}
          <div className="form-group">
            <CustomSelect
              name="area"
              placeholder="Select area"
              options={areas}
              value={values.area}
              label="AREA"
            />
          </div>
          {/* ingredients */}
          <div className="">
            <div className="flex flex-col gap-[2rem]">
              <CustomSelect
                name="selectedIngredientId"
                placeholder="Add the ingredient"
                options={ingredientsList}
                value={values.selectedIngredientId}
                label="Ingredient"
              />

              <Field
                type="text"
                name="ingredientQuantity"
                placeholder="Enter quantity"
                className="text-[1.4rem] border-b pb-[1.6rem] border-(--grey) focus:outline-none bg-transparent"
              />
            </div>

            <FormError name="ingredientQuantity" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddIngredient}
          className={`border border-(--gray) rounded-[3rem] px-[2rem] py-[1.4rem] 
             flex items-center justify-center w-[18.8rem] text-[1.4rem] font-[700] gap-[0.8rem] uppercase 
             leading-[143%] border-(--grey) ${values.ingredients.length > 0 ? "mb-[3.2rem]" : "mb-[6.4rem]"} `}
        >
          ADD INGREDIENT
          <Icon name="plus" size={16} className="fill-(--black) stroke-(--black)" />
        </button>
        {values.ingredients.length > 0 && (
          <IngredientList ingredients={values.ingredients} onRemove={handleRemoveIngredient} />
        )}

        {/* instructions */}
        <div className="">
          <label className="uppercase font-[800] leading-[150%] mb-[3.2rem] block">
            RECIPE PREPARATION
            <span className="block mt-[3.2rem]">
              <CustomTextarea name="instructions" placeholder="Enter recipe" />
            </span>
            <FormError name="instructions" />
          </label>
        </div>

        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            className="border border-(--grey) rounded-[50%] p-[1.4rem] flex items-center justify-center"
            disabled={isSubmitting}
            onClick={() => handleResetForm(resetForm)}
          >
            <Icon name="trash-04" size={20} className="stroke-(--grey)" />
          </button>
          <button
            type="submit"
            className="bg-(--black) text-(--white) rounded-[3rem] px-[3.2rem] py-[1.4rem] 
            flex items-center justify-center font-[700] text-[1.4rem] uppercase leading-[143%] 
             transition-opacity"
            disabled={isSubmitting}
          >
            PUBLISH
          </button>
        </div>
      </div>
    </Form>
  );
};

export default RecipeFormContent;

// added FormError component to be used in CustomSelect and RecipeFormContent
export const FormError = ({ name }) => {
  return <ErrorMessage name={name} component="div" className="text-(--red) text-[1.2rem]" />;
};

const CustomTextarea = ({ name, placeholder, maxLength = 200, className }) => {
  const { values } = useFormikContext();
  const currentLength = values[name] ? values[name].length : 0;

  return (
    <div className={clsx("relative w-full border-b border-(--grey) pb-[1.2rem]", className)}>
      <Field
        as="textarea"
        name={name}
        rows={1}
        placeholder={placeholder}
        maxLength={maxLength}
        className="scrollbar-none w-full pr-[8rem] focus:outline-none 
          bg-transparent text-[1.4rem] resize-none overflow-hidden block min-h-[2.4rem]"
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <span className="absolute right-0 top-0 text-[1.4rem] flex items-center">
        <span className="text-(--black)">{currentLength}</span>
        <span className="text-(--grey)">/{maxLength}</span>
      </span>
    </div>
  );
};
