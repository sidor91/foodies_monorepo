import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAreas,
  fetchCategories,
  fetchIngredients,
  fetchTestimonials,
} from "../../../redux/references/referencesOps.js";
import {
  selectAreas,
  selectCategories,
  selectIngredients,
  selectReferencesError,
  selectReferencesIsLoading,
  selectTestimonials,
} from "../../../redux/references/referencesSelectors.js";
import { fetchRecipes } from "../../../redux/recipes/recipesOps.js";
import {
  selectRecipes,
  selectRecipesError,
  selectRecipesIsLoading,
  selectRecipesPagination,
} from "../../../redux/recipes/recipesSelectors.js";
import { selectFavoriteIds } from "../../../redux/favorites/favoritesSelectors.js";
import Category from "../../components/Category/Category.jsx";
import Categories from "../../components/Categories/Categories.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import Testimonials from "../../components/Testimonials/Testimonials.jsx";
import useFavoriteToggle from "../../hooks/useFavoriteToggle.js";
import useOpenRecipe from "../../hooks/useOpenRecipe.js";

import css from "./Home.module.css";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Home = ({ isAuthenticated, onRequireLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const ingredients = useSelector(selectIngredients);
  const testimonials = useSelector(selectTestimonials);
  const recipes = useSelector(selectRecipes);
  const recipesError = useSelector(selectRecipesError);
  const recipesPagination = useSelector(selectRecipesPagination);
  const referencesLoading = useSelector(selectReferencesIsLoading);
  const recipesLoading = useSelector(selectRecipesIsLoading);
  const referencesError = useSelector(selectReferencesError);
  const favoriteIds = useSelector(selectFavoriteIds);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [page, setPage] = useState(1);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const selectedCategory = useMemo(() => {
    if (!categorySlug) {
      return null;
    }

    return categories.find((category) => slugify(category.name) === categorySlug) || null;
  }, [categories, categorySlug]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTestimonials());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedArea("");
    setSelectedIngredient("");
    setPage(1);
  }, [categorySlug]);

  useEffect(() => {
    if (!activeCategory) {
      return;
    }

    dispatch(
      fetchRecipes({
        category: activeCategory.id,
        area: selectedArea,
        ingredient: selectedIngredient,
        page,
      }),
    );
  }, [activeCategory, dispatch, page, selectedArea, selectedIngredient]);

  useEffect(() => {
    setTestimonialIndex(0);
  }, [testimonials.length]);

  const handleCategorySelect = (category) => {
    if (!category) {
      return;
    }

    setIsAllExpanded(false);
    navigate(`/categories/${slugify(category.name)}`);
  };

  const handleShowAllCategories = () => {
    setIsAllExpanded(true);
  };

  const handleBackFromCategory = () => {
    setIsAllExpanded(false);
    navigate("/");
    setActiveCategory(null);
  };

  const handleFavoriteToggle = useFavoriteToggle({ favoriteIds, isAuthenticated, onRequireLogin });
  const handleOpenRecipe = useOpenRecipe();

  const shouldShowCategory = Boolean(activeCategory);

  return (
    <div className={css.home}>
      <Hero />

      <div className={css.categoriesSwitcher}>
        {shouldShowCategory ? (
          <Category
            title={activeCategory.name}
            recipes={recipes}
            favoriteIds={favoriteIds}
            ingredients={ingredients}
            areas={areas}
            selectedIngredient={selectedIngredient}
            selectedArea={selectedArea}
            onIngredientChange={setSelectedIngredient}
            onAreaChange={setSelectedArea}
            onBack={handleBackFromCategory}
            page={page}
            totalPages={recipesPagination.totalPages}
            onPageChange={setPage}
            onFavoriteToggle={handleFavoriteToggle}
            onOpenRecipe={handleOpenRecipe}
            isLoading={recipesLoading}
            error={recipesError}
          />
        ) : (
          <Categories
            categories={categories}
            isLoading={referencesLoading}
            error={referencesError}
            onCategorySelect={handleCategorySelect}
            isAllExpanded={isAllExpanded}
            onShowAllCategories={handleShowAllCategories}
          />
        )}
      </div>

      <Testimonials
        testimonials={testimonials}
        activeIndex={testimonialIndex}
        onIndexChange={setTestimonialIndex}
        isLoading={referencesLoading}
      />
    </div>
  );
};

export default Home;
