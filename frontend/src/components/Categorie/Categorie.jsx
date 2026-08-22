import css from "./Categorie.module.css";

const getAssetName = (name) => {
  const aliases = { Dessert: "Desserts" };
  return aliases[name] || name;
};

const Categorie = ({
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

  return (
    <section className={css.categorie} aria-labelledby="categorie-title">
      <button className={css.back} type="button" onClick={() => onBack?.()}>
        <span aria-hidden="true">&lt;-</span>
        Back
      </button>

      <h1 id="categorie-title">{title}</h1>
      <p className={css.description}>{description}</p>

      {isAllCategories ? (
        <>
          {isLoading && <p className={css.empty}>Loading categories...</p>}
          {error && !isLoading && <p className={css.empty}>Failed to load categories.</p>}

          {!isLoading && !error && hasAllCategories ? (
            <ul className={css.categoryGrid}>
              {allCategories.map((category) => {
                const assetName = getAssetName(category.name);

                return (
                  <li key={category.id}>
                    <button
                      className={css.categoryCard}
                      type="button"
                      onClick={() => onCategorySelect?.(category)}
                    >
                      <img
                        src={`/categories/${assetName}.webp`}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                      <div className={css.categoryOverlay}>
                        <span>{category.name}</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : !isLoading && !error ? (
            <p className={css.empty}>No categories available.</p>
          ) : null}
        </>
      ) : (
        <>
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

          {isLoading && <p className={css.empty}>Loading recipes...</p>}
          {error && !isLoading && <p className={css.empty}>Failed to load recipes.</p>}

          {!isLoading && !error && hasRecipes ? (
            <>
              <ul className={css.grid}>
                {recipes.map((recipe) => (
                  <li className={css.card} key={recipe.id}>
                    <img src={recipe.image} alt={recipe.title} />

                    <h2>{recipe.title}</h2>
                    <p className={css.recipeText}>{recipe.description || "No description yet."}</p>

                    <div className={css.meta}>
                      <div className={css.owner}>
                        <span>{recipe.area?.name || "Foodies"}</span>
                      </div>

                      <div className={css.actions}>
                        <button
                          type="button"
                          onClick={() => onFavoriteToggle?.(recipe.id)}
                          aria-label="Toggle favorite"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 21s-7-4.7-9.2-8.2C1.4 10.5 2 7.2 4.7 5.6A5.2 5.2 0 0 1 12 8a5.2 5.2 0 0 1 7.3-2.4c2.7 1.6 3.3 4.9 1.9 7.2C19 16.3 12 21 12 21Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenRecipe?.(recipe.id)}
                          aria-label="Open recipe"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </button>
                      </div>
                    </div>
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
        </>
      )}
    </section>
  );
};

export default Categorie;
