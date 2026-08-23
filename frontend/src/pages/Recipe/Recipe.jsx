import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchPopularRecipes, fetchRecipeById } from "../../../redux/recipes/recipesOps.js";
import { clearCurrentRecipe } from "../../../redux/recipes/recipesSlice.js";
import {
  selectCurrentRecipe,
  selectPopularRecipes,
  selectRecipesError,
  selectRecipesIsLoading,
} from "../../../redux/recipes/recipesSelectors.js";
import { addFavorite, removeFavorite } from "../../../redux/favorites/favoritesOps.js";
import {
  selectFavoriteIds,
  selectFavoritesPendingIds,
} from "../../../redux/favorites/favoritesSelectors.js";
import { Button, RecipeCard } from "../../components/index.js";

import css from "./Recipe.module.css";

const Recipe = ({ isAuthenticated, onRequireLogin }) => {
  const { recipeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recipe = useSelector(selectCurrentRecipe);
  const popularRecipes = useSelector(selectPopularRecipes);
  const isLoading = useSelector(selectRecipesIsLoading);
  const error = useSelector(selectRecipesError);
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

  const handleFavoriteToggle = (id) => {
    if (!isAuthenticated) {
      onRequireLogin?.();
      return;
    }

    dispatch(favoriteIds.includes(id) ? removeFavorite(id) : addFavorite(id));
  };

  const handleOpenRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

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
        <img className={css.image} src={recipe.image} alt={recipe.title} />

        <div className={css.content}>
          <h1>{recipe.title}</h1>

          <div className={css.badges}>
            {recipe.category?.name && <span className={css.badge}>{recipe.category.name}</span>}
            {recipe.time ? <span className={css.badge}>{recipe.time} min</span> : null}
          </div>

          <p className={css.description}>{recipe.description}</p>

          <div className={css.owner}>
            <img
              className={css.ownerAvatar}
              src={recipe.owner?.avatarUrl}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div>
              <p className={css.ownerLabel}>Created by:</p>
              <p className={css.ownerName}>{recipe.owner?.name}</p>
            </div>
          </div>

          <h2>Ingredients</h2>
          <ul className={css.ingredients}>
            {recipe.ingredients.map((item) => (
              <li className={css.ingredient} key={item.ingredientId}>
                <img
                  className={css.ingredientImage}
                  src={item.ingredient.img}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
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
