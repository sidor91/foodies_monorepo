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
      <>
        <div
          className="w-full max-w-[34.3rem] tablet:max-w-[70.4rem] h-[31.8rem] tablet:h-[40rem] rounded-[3rem] border border-dashed
         border-(--gray) overflow-hidden mb-[3.2rem] mx-auto"
        >
          <label className="pointer-events-auto w-full h-full cursor-pointer flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Recipe preview" className="w-full h-full object-cover" />
            ) : (
              <div className="mx-auto flex flex-col items-center justify-center gap-[0.8rem] ">
                <Icon
                  name="add-image"
                  size={50}
                  className="fill-(--black)/20 tablet:w-[6.4rem] tablet:h-[6.4rem]"
                />
                <span className="text-[1.4rem] tablet:text-[1.6rem] block leading-[143%] tablet:leading-[150%] underline text-(--black)">
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
      </>
      <div>
        {/* title and description */}
        <label className="mb-[3.2rem] tablet:mb-[4rem] block">
          <Field
            name="title"
            type="text"
            placeholder="The name of the recipe"
            className="font-extrabold text-[1.8rem] tablet:text-[2.4rem] leading-[133%] tablet:font-[800] uppercase text-(--gray)"
          />
          <FormError name="title" />
        </label>

        <div className="mb-[3.2rem] tablet:mb-[6rem]">
          <CustomTextarea name="description" placeholder="Enter a description of the dish" />
          <FormError name="description" />
        </div>
        <div className="flex flex-col gap-[2rem] tablet:gap-[6rem] mb-[3.2rem] tablet:mb-[4rem]">
          {/* category and time */}
          <div className="flex flex-col w-full gap-[2rem] tablet:flex-row">
            <div className="flex flex-col">
              <CustomSelect
                name="category"
                placeholder="Select category"
                options={categories}
                value={values.category}
                label="CATEGORY"
                className="tablet:w-[31.6rem]"
              />
            </div>

            <div className="flex flex-col gap-[0.8rem]">
              <label className="uppercase font-extrabold leading-[150%] tablet:text-[2rem] tablet:leading-[120%]">
                COOKING TIME
              </label>
              <div className="flex items-center gap-[1.2rem] tablet:gap-[1.6rem]">
                <button
                  type="button"
                  className="border rounded-[50%] w-[5.6rem] h-[5.6rem] flex justify-center items-center p-[1.6rem] border-(--grey)"
                  onClick={() => setFieldValue("time", Math.max(1, values.time - 5))}
                >
                  <Icon
                    name="minus"
                    size={16}
                    className="stroke-(--black) tablet:w-[2.4rem] tablet:h-[2.4rem]"
                  />
                </button>
                <span className="font-medium text-[1.4rem] leading-[143%] text-(--grey)">
                  {values.time} min
                </span>
                <button
                  type="button"
                  className="border rounded-[50%] w-[5.6rem] h-[5.6rem] flex justify-center items-center p-[1.6rem] 
                   border-(--grey)"
                  onClick={() => setFieldValue("time", values.time + 5)}
                >
                  <Icon
                    name="plus"
                    size={16}
                    className="stroke-(--black) tablet:w-[2.4rem] tablet:h-[2.4rem]"
                  />
                </button>
              </div>
            </div>
          </div>
          {/* area */}
          <div className="tablet:w-[33rem]">
            <CustomSelect
              name="area"
              placeholder="Select area"
              options={areas}
              value={values.area}
              label="AREA"
              className="tablet:w-[33rem]"
            />
          </div>

          {/* ingredients */}
          <div className="">
            <div className="flex flex-col tablet:flex-row tablet:items-end gap-[2rem] ">
              <CustomSelect
                name="selectedIngredientId"
                placeholder="Add the ingredient"
                options={ingredientsList}
                value={values.selectedIngredientId}
                label="Ingredient"
                className="tablet:w-[31.6rem]"
              />

              <Field
                type="text"
                name="ingredientQuantity"
                placeholder="Enter quantity"
                className="text-[1.4rem] tablet:text-[1.6rem] leading-[143%] tablet:leading-[150%] border-b pb-[1.6rem] border-(--grey) focus:outline-none bg-transparent"
              />
            </div>

            <FormError name="ingredientQuantity" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddIngredient}
          className={`border border-(--gray) rounded-[3rem] px-[2rem] py-[1.4rem] 
             flex items-center justify-center w-[18.8rem] tablet:w-[23rem] text-[1.4rem] tablet:text-[1.6rem] font-[700] 
             gap-[0.8rem] uppercase 
             leading-[143%] tablet:leading-[150%] border-(--grey)
             ${values.ingredients.length > 0 ? "mb-[3.2rem] tablet:mb-[4rem]" : "mb-[6.4rem] tablet:mb-[8rem]"} `}
        >
          ADD INGREDIENT
          <Icon
            name="plus"
            size={20}
            className="fill-(--black) stroke-(--black) tablet:w-[2.2rem] tablet:h-[2.2rem]"
          />
        </button>
        {values.ingredients.length > 0 && (
          <IngredientList ingredients={values.ingredients} onRemove={handleRemoveIngredient} />
        )}

        {/* instructions */}
        <div className="">
          <div className="flex flex-col mb-[3.2rem]">
            {/* Текст підпису (лейбл) */}
            <span className="uppercase font-[800] leading-[150%] tablet:leading-[120%] tablet:text-[2rem] mb-[3.2rem] block">
              Recipe preparation
            </span>

            {/* Поле вводу */}
            <CustomTextarea name="instructions" placeholder="Enter recipe" />

            {/* Повідомлення про помилку */}
            <FormError name="instructions" />
          </div>
        </div>

        <div className="flex items-center gap-[0.8rem]">
          <button
            type="button"
            className="border border-(--grey) rounded-[50%] p-[1.4rem] tablet:p-[1.8rem] flex items-center justify-center"
            disabled={isSubmitting}
            onClick={() => handleResetForm(resetForm)}
          >
            <Icon
              name="trash-04"
              size={20}
              className="stroke-(--grey) tablet:w-[2.rem] tablet:h-[2.rem]"
            />
          </button>
          <button
            type="submit"
            className="bg-(--black) text-(--white) rounded-[3rem] px-[3.2rem] py-[1.4rem] 
            tablet:px-[3.9rem] tablet:py-[1.6rem]
            flex items-center justify-center font-[700] text-[1.4rem] uppercase leading-[143%] 
             transition-opacity tablet:text-[1.6rem] tablet:leading-[150%]"
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
          bg-transparent text-[1.4rem] tablet:text-[1.6rem] leading-[143%] tablet:leading-[150%] resize-none overflow-hidden block min-h-[2.4rem]"
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <span className="absolute right-0 top-0 text-[1.4rem] tablet:text-[1.6rem] flex items-center leading-[143%] tablet:leading-[150%]">
        <span className="text-(--black)">{currentLength}</span>
        <span className="text-(--grey)">/{maxLength}</span>
      </span>
    </div>
  );
};
