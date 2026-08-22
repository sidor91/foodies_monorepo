import { Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import { selectRecipeMetadata } from "../../../redux/recipes/recipesSlice";
import useRecipeForm from "../../hooks/useRecipeForm.js";
import css from "./RecipeFormContent.module.css";
import IngredientList from "../IngredientList/IngredientList.jsx";
import { useFormikContext } from "formik";

const RecipeFormContent = ({ isSubmitting }) => {
  const { categories, areas, ingredientsList, error, isLoading } =
    useSelector(selectRecipeMetadata);
  const { resetForm } = useFormikContext();

  const {
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
    values,
    setFieldValue,
    handleResetForm,
    errors,
  } = useRecipeForm();

  return (
    <Form>
      {/* Дебаг блок */}
      <div style={{ backgroundColor: "pink", padding: "10px", marginBottom: "20px" }}>
        <p>
          <strong>Поточні значення:</strong>
        </p>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
      <div style={{ backgroundColor: "#ffcccc", padding: "10px", marginBottom: "20px" }}>
        <p>
          <strong>Помилки валідації (Errors):</strong>
        </p>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>

      <div className="upload-container">
        <label className="upload-content" style={{ cursor: "pointer", display: "block" }}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Recipe preview"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="upload-placeholder">
              <span className="camera-icon">📷</span>
              <span className="upload-btn">Upload a photo</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, setFieldValue)}
          />
        </label>
        <ErrorMessage name="photo" component="div" className={css.error} />
      </div>

      {/* Назва та опис */}
      <div className="form-group">
        <Field
          name="title"
          type="text"
          placeholder="The name of the recipe"
          className="recipe-title-input"
        />
        <ErrorMessage name="title" component="div" className={css.error} />

        <div className="input-with-counter">
          <Field
            name="description"
            type="text"
            placeholder="Enter a description of the dish"
            className="recipe-desc-input"
          />
          <span className="counter">{values.description.length}/200</span>
        </div>
        <ErrorMessage name="description" component="div" className={css.error} />
      </div>

      {/* Категорія та час */}
      <div className="form-row" style={{ display: "flex", gap: "20px" }}>
        <div className="form-group half">
          <label>CATEGORY</label>
          <Field as="select" name="category" className="select-box">
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Field>
          <ErrorMessage name="category" component="div" className={css.error} />
        </div>

        <div className="form-group half">
          <label>COOKING TIME</label>
          <div className="time-controls" style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="circle-btn"
              onClick={() => setFieldValue("time", Math.max(1, values.time - 5))}
            >
              -
            </button>
            <span style={{ margin: "0 10px" }}>{values.time} min</span>
            <button
              type="button"
              className="circle-btn"
              onClick={() => setFieldValue("time", values.time + 5)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Регіон */}
      <div className="form-group">
        <label>AREA</label>
        <Field as="select" name="area" className="select-box">
          <option value="" disabled>
            Area
          </option>
          {areas.map((ar) => (
            <option key={ar.id} value={ar.id}>
              {ar.name}
            </option>
          ))}
        </Field>
        <ErrorMessage name="area" component="div" className={css.error} />
      </div>

      {/* Інгредієнти */}
      <div className={css.ingredientsSection}>
        <h3>INGREDIENTS</h3>
        <div className={css.addControls}>
          <select
            value={currentIngredientId}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              setCurrentIngredientId(e.target.value);
              setCurrentIngredientName(selectedOption.text);
            }}
            className={css.select}
          >
            <option value="">Add the ingredient</option>
            {ingredientsList.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            placeholder="Enter quantity"
            className={css.input}
          />
        </div>

        <button
          type="button"
          onClick={handleAddIngredient}
          className={css.addBtn}
          disabled={!currentIngredientId || !currentQuantity || values.ingredients.length >= 30}
        >
          ADD INGREDIENT +
        </button>

        <ErrorMessage name="ingredients" component="div" className={css.error} />
        {values.ingredients.length > 0 && (
          <IngredientList ingredients={values.ingredients} onRemove={handleRemoveIngredient} />
        )}
      </div>

      {/* Інструкції */}
      <div className="form-group">
        <label>RECIPE PREPARATION</label>
        <div className="input-with-counter">
          <Field
            as="textarea"
            name="instructions"
            placeholder="Enter recipe"
            rows="4"
            className="preparation-textarea"
          />
          <span className="counter">{values.instructions.length}/1000</span>
        </div>
        <ErrorMessage name="instructions" component="div" className={css.error} />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="publish-btn"
          disabled={isSubmitting}
          onClick={() => handleResetForm(resetForm)}
        >
          del11
        </button>
        <button type="submit" className="publish-btn" disabled={isSubmitting}>
          PUBLISH
        </button>
      </div>
    </Form>
  );
};

export default RecipeFormContent;
