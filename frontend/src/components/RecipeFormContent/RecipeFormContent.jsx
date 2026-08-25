import { Form, Field, ErrorMessage, useFormikContext } from "formik";
import { useSelector } from "react-redux";
import useRecipeForm from "../../hooks/useRecipeForm.js";
import IngredientList from "../IngredientList/IngredientList.jsx";
import {
  selectCategories,
  selectAreas,
  selectIngredients,
} from "../../../redux/references/referencesSelectors.js";
import CustomSelect from "../CustomSelect/CustomSelect.jsx";
import Icon from "../Icon/Icon.jsx";
import clsx from "clsx";

const RecipeFormContent = ({ isSubmitting }) => {
  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const ingredientsList = useSelector(selectIngredients);

  const { resetForm } = useFormikContext();

  const {
    handleAddIngredient,
    handleRemoveIngredient,
    handleImageUpload,
    previewUrl,
    values,
    setFieldValue,
    handleResetForm,
    saveCurrentDraft,
  } = useRecipeForm();

  return (
    <Form onBlur={saveCurrentDraft}>
      <div>
        <div className="max-w-[34.3rem] h-[31.8rem] rounded-[3rem] border border-dashed border-secondary overflow-hidden mb-[3.2rem]">
          <label className="upload-content" style={{ cursor: "pointer", display: "block" }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Recipe preview" className="w-full h-full object-cover" />
            ) : (
              <div className="mx-auto flex flex-col items-center justify-center my-48 gap-[0.8rem] ">
                <Icon name="add-image" size={50} className="fill-(--black)/20" />
                <span className="text-[1.4rem] block leading-[143%] underline text-accent">
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
        <Field
          name="title"
          type="text"
          placeholder="The name of the recipe"
          className="font-extrabold text-[1.8rem] leading-[133%] uppercase text-secondary mb-[3.2rem]"
        />
        <FormError name="title" />

        <CustomTextarea name="description" placeholder="Enter a description of the dish" />
        <FormError name="description" />
        <div className="flex flex-col gap-8 mb-8">
          {/* category and time */}
          <div className="flex flex-col w-full gap-8">
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
                  className="border rounded-[50%] flex justify-center items-center p-[1.6rem] border-secondary"
                  onClick={() => setFieldValue("time", Math.max(1, values.time - 5))}
                >
                  <Icon name="minus" size={16} className="stroke-accent" />
                </button>
                <span className="font-medium text-[1.4rem] leading-[143%] text-secondary">
                  {values.time} min
                </span>
                <button
                  type="button"
                  className="border rounded-[50%] flex justify-center items-center p-[1.6rem]  border-secondary"
                  onClick={() => setFieldValue("time", values.time + 5)}
                >
                  <Icon name="plus" size={16} className="stroke-accent" />
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
            <div className="flex flex-col gap-8">
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
                className="text-[1.4rem] border-b pb-[1.6rem] border-secondary focus:outline-none bg-transparent"
              />
            </div>

            <FormError name="ingredientQuantity" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddIngredient}
          className={`border border-secondary rounded-[3rem] px-8 py-[1.4rem] 
             flex items-center justify-center w-[18.8rem] text-[1.4rem] font-bold gap-[0.8rem] uppercase 
             leading-[143%] border-secondary ${values.ingredients.length > 0 ? "mb-[3.2rem]" : "mb-[6.4rem]"} `}
        >
          ADD INGREDIENT
          <Icon name="plus" size={16} className="fill-(--black) stroke-(--black)" />
        </button>
        {values.ingredients.length > 0 && (
          <IngredientList ingredients={values.ingredients} onRemove={handleRemoveIngredient} />
        )}

        {/* instructions */}
        <div className="">
          <label className="uppercase font-bold leading-[150%] mb-[3.2rem] block">
            RECIPE PREPARATION
          </label>

          <CustomTextarea name="instructions" placeholder="Enter recipe" />
        </div>

        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            className="border border-secondary rounded-[50%] p-[1.4rem] flex items-center justify-center"
            disabled={isSubmitting}
            onClick={() => handleResetForm(resetForm)}
          >
            <Icon name="trash-04" size={20} className="stroke-secondary" />
          </button>
          <button
            type="submit"
            className="bg-accent text-bg rounded-[3rem] px-[3.2rem] py-[1.4rem] 
            flex items-center justify-center font-bold text-[1.4rem] uppercase leading-[143%] 
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
  return <ErrorMessage name={name} component="div" className="text-error text-[1.2rem] mt-1" />;
};

const CustomTextarea = ({ name, placeholder, maxLength = 200, className }) => {
  const { values } = useFormikContext();
  const currentLength = values[name] ? values[name].length : 0;

  return (
    <div
      className={clsx(
        "relative w-full mb-[3.2rem] border-b border-secondary pb-[1.2rem]",
        className,
      )}
    >
      <Field
        as="textarea"
        name={name}
        rows={1}
        placeholder={placeholder}
        maxLength={maxLength}
        className="scrollbar-none w-full pr-32 focus:outline-none 
          bg-transparent text-[1.4rem] resize-none overflow-hidden block min-h-[2.4rem]"
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <span className="absolute right-0 top-0 text-[1.4rem] flex items-center">
        <span className="text-accent">{currentLength}</span>
        <span className="text-secondary">/{maxLength}</span>
      </span>

      <ErrorMessage
        name={name}
        component="div"
        className="absolute left-0 bottom-8 text-error text-[1.2rem]"
      />
    </div>
  );
};
