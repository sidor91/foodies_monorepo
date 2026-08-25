import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchPopularRecipes, fetchRecipeById } from "../../../redux/recipes/recipesOps.js";
import { clearCurrentRecipe } from "../../../redux/recipes/recipesSlice.js";
import {
  selectCurrentRecipe,
  selectCurrentRecipeError,
  selectCurrentRecipeIsLoading,
  selectPopularRecipes,
} from "../../../redux/recipes/recipesSelectors.js";
import {
  selectFavoriteIds,
  selectFavoritesPendingIds,
} from "../../../redux/favorites/favoritesSelectors.js";
import { Button, ImageWithFallback, RecipeCard } from "../../components/index.js";
import useFavoriteToggle from "../../hooks/useFavoriteToggle.js";
import useOpenRecipe from "../../hooks/useOpenRecipe.js";

import css from "./Recipe.module.css";

const Recipe = ({ isAuthenticated, onRequireLogin }) => {
  const { recipeId } = useParams();
  const dispatch = useDispatch();

  const recipe = useSelector(selectCurrentRecipe);
  const popularRecipes = useSelector(selectPopularRecipes);
  const isLoading = useSelector(selectCurrentRecipeIsLoading);
  const error = useSelector(selectCurrentRecipeError);
  const favoriteIds = useSelector(selectFavoriteIds);
  const pendingIds = useSelector(selectFavoritesPendingIds);

  const isReady = recipe?.id === recipeId;
  const isFavorite = favoriteIds.includes(recipeId);
  const isFavoritePending = pendingIds.includes(recipeId);

  useEffect(() => {
    dispatch(fetchRecipeById(recipeId));
    dispatch(fetchPopularRecipes(4));

    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, recipeId]);

  const handleFavoriteToggle = useFavoriteToggle({ favoriteIds, isAuthenticated, onRequireLogin });
  const handleOpenRecipe = useOpenRecipe();

  if (!isReady) {
    if (isLoading) {
      return <p className={css.state}>Loading recipe...</p>;
    }

    if (error) {
      return <p className={css.state}>Failed to load recipe.</p>;
    }

    return null;
  }

  const relatedRecipes = popularRecipes.filter((item) => item.id !== recipe.id);

  return (
    <div className={css.recipe}>
      <nav className={css.breadcrumb} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>{recipe.title}</span>
      </nav>

      <div className={css.layout}>
        <ImageWithFallback className={css.image} src={recipe.image} alt={recipe.title} />

        <div className={css.content}>
          <h1>{recipe.title}</h1>

          <div className={css.badges}>
            {recipe.category?.name && <span className={css.badge}>{recipe.category.name}</span>}
            {recipe.time ? <span className={css.badge}>{recipe.time} min</span> : null}
          </div>

          <p className={css.description}>{recipe.description}</p>

          <div className={css.owner}>
            <ImageWithFallback className={css.ownerAvatar} src={recipe.owner?.avatarUrl} alt="" />
            <div>
              <p className={css.ownerLabel}>Created by:</p>
              <p className={css.ownerName}>{recipe.owner?.name}</p>
            </div>
          </div>

          <h2>Ingredients</h2>
          <ul className={css.ingredients}>
            {(recipe.ingredients ?? []).map((item) => (
              <li className={css.ingredient} key={item.ingredientId}>
                <ImageWithFallback
                  className={css.ingredientImage}
                  src={item.ingredient.img}
                  alt=""
                />
                <div>
                  <p className={css.ingredientName}>{item.ingredient.name}</p>
                  {item.measure && <p className={css.ingredientMeasure}>{item.measure}</p>}
                </div>
              </li>
            ))}
          </ul>

          <h2>Recipe Preparation</h2>
          <p className={css.instructions}>{recipe.instructions}</p>

          <Button
            variant="secondary"
            isActive={isFavorite}
            disabled={isFavoritePending}
            className={css.favoriteButton}
            onClick={() => handleFavoriteToggle(recipe.id)}
          >
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </Button>
        </div>
      </div>

      {relatedRecipes.length > 0 && (
        <section className={css.popular} aria-labelledby="popular-recipes-title">
          <h2 id="popular-recipes-title">Popular Recipes</h2>
          <ul className={css.popularGrid}>
            {relatedRecipes.map((item) => (
              <li key={item.id}>
                <RecipeCard
                  recipe={item}
                  isFavorite={favoriteIds.includes(item.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onOpenRecipe={handleOpenRecipe}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Recipe;
