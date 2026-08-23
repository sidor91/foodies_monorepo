import css from "./Category.module.css";
import CategoryCard from "../CategoryCard/CategoryCard.jsx";
import RecipeCard from "../RecipeCard/RecipeCard.jsx";

const getAssetName = (name) => {
  const aliases = { Dessert: "Desserts" };
  return aliases[name] || name;
};

const Category = ({
  title = "Desserts",
  description = "Go on a taste journey, where every sip is a sophisticated creative chord, and every dessert is an expression of the most refined gastronomic desires.",
  allCategories = [],
  isAllCategories = false,
  onCategorySelect,
  recipes = [],
  ingredients = [],
  areas = [],
  selectedIngredient = "",
  selectedArea = "",
  onIngredientChange,
  onAreaChange,
  onBack,
  page = 1,
  totalPages = 1,
  onPageChange,
  onFavoriteToggle,
  onOpenRecipe,
  isLoading = false,
  error = null,
}) => {
  const hasRecipes = recipes.length > 0;
  const pages = Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1);
  const hasAllCategories = allCategories.length > 0;
  const allCategoryRows = Array.from(
    { length: Math.ceil(allCategories.length / 3) },
    (_, rowIndex) => allCategories.slice(rowIndex * 3, rowIndex * 3 + 3),
  );

  return (
    <section className={css.category} aria-labelledby="category-title">
      <button className={css.back} type="button" onClick={() => onBack?.()}>
        <svg className={css.backIcon}>
          <use href="/icons.svg#icon-arrow-left" />
        </svg>
        Back
      </button>

      {isAllCategories ? (
        <div className={css.categoriesHeading}>
          <h2 id="category-title">Categories</h2>
          <p>
            Discover a limitless world of culinary possibilities and enjoy exquisite recipes that
            combine taste, style and the warm atmosphere of the kitchen.
          </p>
        </div>
      ) : (
        <>
          <h1 id="category-title">{title}</h1>
          <p className={css.description}>{description}</p>
        </>
      )}

      {isAllCategories ? (
        <>
          {isLoading && <p className={css.empty}>Loading categories...</p>}
          {error && !isLoading && <p className={css.empty}>Failed to load categories.</p>}

          {!isLoading && !error && hasAllCategories ? (
            <div className={css.categoryGrid}>
              {allCategoryRows.map((row, rowIndex) => (
                <div
                  className={`${css.categoryRow} ${css[`categoryRow${(rowIndex % 4) + 1}`]}`}
                  key={`all-row-${rowIndex + 1}`}
                >
                  {row.map((category) => {
                    const assetName = getAssetName(category.name);

                    return (
                      <article className={css.categoryCard} key={category.id}>
                        <CategoryCard
                          name={category.name}
                          image={`/categories/${assetName}.webp`}
                          onSelect={() => onCategorySelect?.(category)}
                        />
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : !isLoading && !error ? (
            <p className={css.empty}>No categories available.</p>
          ) : null}
        </>
      ) : (
        <div className={css.contentLayout}>
          <div className={css.filters}>
            <label className={css.filter}>
              <span className={css.srOnly}>Filter by ingredient</span>
              <select
                value={selectedIngredient}
                onChange={(event) => onIngredientChange?.(event.target.value)}
              >
                <option value="">Ingredients</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id || ingredient.name} value={ingredient.id || ""}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={css.filter}>
              <span className={css.srOnly}>Filter by area</span>
              <select value={selectedArea} onChange={(event) => onAreaChange?.(event.target.value)}>
                <option value="">Area</option>
                {areas.map((area) => (
                  <option key={area.id || area.name} value={area.id || ""}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={css.gridContainer}>
            {isLoading && <p className={css.empty}>Loading recipes...</p>}
            {error && !isLoading && <p className={css.empty}>Failed to load recipes.</p>}

            {!isLoading && !error && hasRecipes ? (
              <>
                <ul className={css.grid}>
                  {recipes.map((recipe) => (
                    <li key={recipe.id}>
                      <RecipeCard
                        recipe={recipe}
                        onFavoriteToggle={onFavoriteToggle}
                        onOpenRecipe={onOpenRecipe}
                      />
                    </li>
                  ))}
                </ul>

                <div className={css.pagination} aria-label="Pagination">
                  {pages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={pageNumber === page ? css.pageActive : ""}
                      onClick={() => onPageChange?.(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
              </>
            ) : !isLoading && !error ? (
              <p className={css.empty}>No recipes found for current filters.</p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default Category;
