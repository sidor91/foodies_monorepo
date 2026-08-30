import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAreas, fetchIngredients } from "../../../redux/references/referencesOps.js";
import { selectAreas, selectIngredients } from "../../../redux/references/referencesSelectors.js";
import { fetchRecipes } from "../../../redux/recipes/recipesOps.js";
import {
  selectRecipes,
  selectRecipesError,
  selectRecipesIsLoading,
  selectRecipesPagination,
} from "../../../redux/recipes/recipesSelectors.js";
import { selectFavoriteIds } from "../../../redux/favorites/favoritesSelectors.js";
import { selectIsLoggedIn } from "../../../redux/auth/authSelectors.js";
import useFavoriteToggle from "../../hooks/useFavoriteToggle.js";
import Dropdown from "../Dropdown/Dropdown.jsx";
import css from "./Category.module.css";
import RecipeCard from "../RecipeCard/RecipeCard.jsx";

const DEFAULT_DESCRIPTION =
  "Go on a taste journey, where every sip is a sophisticated creative chord, and every dessert is an expression of the most refined gastronomic desires.";

const Category = ({ category, onBack, onRequireLogin }) => {
  const dispatch = useDispatch();

  const areas = useSelector(selectAreas);
  const ingredients = useSelector(selectIngredients);
  const recipes = useSelector(selectRecipes);
  const isLoading = useSelector(selectRecipesIsLoading);
  const error = useSelector(selectRecipesError);
  const { totalPages } = useSelector(selectRecipesPagination);
  const favoriteIds = useSelector(selectFavoriteIds);
  const isAuthenticated = useSelector(selectIsLoggedIn);

  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [page, setPage] = useState(1);

  const handleFavoriteToggle = useFavoriteToggle({ favoriteIds, isAuthenticated, onRequireLogin });

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleAreaSelection = (area) => {
    setPage(1);
    setSelectedArea(area);
  };

  const handleIngredientSelection = (ingredient) => {
    setPage(1);
    setSelectedIngredient(ingredient);
  };

  useEffect(() => {
    setSelectedArea("");
    setSelectedIngredient("");
    setPage(1);
  }, [category.id]);

  useEffect(() => {
    dispatch(
      fetchRecipes({
        category: category.id,
        area: selectedArea,
        ingredient: selectedIngredient,
        page,
      }),
    );
  }, [category.id, dispatch, page, selectedArea, selectedIngredient]);

  const hasRecipes = recipes.length > 0;
  const pages = Array.from({ length: Math.max(totalPages, 1) }, (_, index) => index + 1);

  return (
    <section className={css.category} aria-labelledby="category-title">
      <button className={css.back} type="button" onClick={() => onBack?.()}>
        <svg className={css.backIcon}>
          <use href="/icons.svg#icon-arrow-left" />
        </svg>
        Back
      </button>

      <h1 id="category-title" className="section__title">
        {category.name}
      </h1>
      <p className={css.description}>{category.description || DEFAULT_DESCRIPTION}</p>

      <div className={css.contentLayout}>
        <div className={css.filters}>
          <Dropdown
            className={css.filter}
            ariaLabel="Filter by ingredient"
            value={selectedIngredient}
            onChange={handleIngredientSelection}
            options={[{ id: "", name: "Ingredients" }, ...ingredients]}
          />

          <Dropdown
            className={css.filter}
            ariaLabel="Filter by area"
            value={selectedArea}
            onChange={handleAreaSelection}
            options={[{ id: "", name: "Area" }, ...areas]}
          />
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
                      isFavorite={favoriteIds.includes(recipe.id)}
                      onFavoriteToggle={handleFavoriteToggle}
                      onRequireLogin={onRequireLogin}
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
                    onClick={() => setPage(pageNumber)}
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
    </section>
  );
};

export default Category;
