import { useEffect, useMemo, useRef, useState } from "react";
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
import { fetchPopularRecipes, fetchRecipes } from "../../../redux/recipes/recipesOps.js";
import {
  selectPopularRecipes,
  selectRecipes,
  selectRecipesError,
  selectRecipesIsLoading,
  selectRecipesPagination,
} from "../../../redux/recipes/recipesSelectors.js";
import { Categorie, Categories, Hero, Testimonials } from "../../components/index.js";

import css from "./Home.module.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const ingredients = useSelector(selectIngredients);
  const testimonials = useSelector(selectTestimonials);
  const popularRecipes = useSelector(selectPopularRecipes);
  const recipes = useSelector(selectRecipes);
  const recipesError = useSelector(selectRecipesError);
  const recipesPagination = useSelector(selectRecipesPagination);
  const referencesLoading = useSelector(selectReferencesIsLoading);
  const recipesLoading = useSelector(selectRecipesIsLoading);
  const referencesError = useSelector(selectReferencesError);

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isClosingCategorie, setIsClosingCategorie] = useState(false);
  const backAnimationRef = useRef(null);

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const isAllCategoriesSlug = categorySlug === "all-categories";

  const selectedCategory = useMemo(() => {
    if (!categorySlug || isAllCategoriesSlug) {
      return null;
    }

    return categories.find((category) => slugify(category.name) === categorySlug) || null;
  }, [categories, categorySlug, isAllCategoriesSlug]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPopularRecipes(2));
    dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    if (isAllCategoriesSlug) {
      setActiveCategory({ id: null, name: "All categories", isAll: true });
      setIsClosingCategorie(false);
      dispatch(fetchCategories());
      return;
    }

    if (selectedCategory) {
      setActiveCategory({ ...selectedCategory, isAll: false });
      setIsClosingCategorie(false);
      dispatch(fetchAreas());
      dispatch(fetchIngredients());
    }
  }, [dispatch, isAllCategoriesSlug, selectedCategory]);

  useEffect(() => {
    setSelectedArea("");
    setSelectedIngredient("");
    setPage(1);
  }, [categorySlug]);

  useEffect(() => {
    if (!activeCategory || activeCategory.isAll || isClosingCategorie) {
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
  }, [activeCategory, dispatch, isClosingCategorie, page, selectedArea, selectedIngredient]);

  useEffect(() => {
    setTestimonialIndex(0);
  }, [testimonials.length]);

  useEffect(() => {
    return () => {
      if (backAnimationRef.current) {
        clearTimeout(backAnimationRef.current);
      }
    };
  }, []);

  const handleCategorySelect = (category) => {
    if (!category) {
      navigate("/categories/all-categories");
      return;
    }

    navigate(`/categories/${slugify(category.name)}`);
  };

  const handleBackFromCategorie = () => {
    setIsClosingCategorie(true);
    navigate("/");

    if (backAnimationRef.current) {
      clearTimeout(backAnimationRef.current);
    }

    backAnimationRef.current = setTimeout(() => {
      setIsClosingCategorie(false);
      setActiveCategory(null);
    }, 320);
  };

  const shouldShowCategorie = Boolean(activeCategory);

  return (
    <div className={css.home}>
      <Hero recipes={popularRecipes} isLoading={recipesLoading} />

      <div className={css.categoriesSwitcher}>
        <div className={css.categoriesBase}>
          <Categories
            categories={categories}
            isLoading={referencesLoading}
            error={referencesError}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {shouldShowCategorie && (
          <div
            className={`${css.categoriePanel} ${isClosingCategorie ? css.categoriePanel_out : ""}`}
          >
            <Categorie
              title={activeCategory.name}
              allCategories={categories}
              isAllCategories={Boolean(activeCategory.isAll)}
              onCategorySelect={handleCategorySelect}
              recipes={recipes}
              ingredients={ingredients}
              areas={areas}
              selectedIngredient={selectedIngredient}
              selectedArea={selectedArea}
              onIngredientChange={setSelectedIngredient}
              onAreaChange={setSelectedArea}
              onBack={handleBackFromCategorie}
              page={recipesPagination.page || page}
              totalPages={recipesPagination.totalPages || 1}
              onPageChange={setPage}
              isLoading={activeCategory.isAll ? referencesLoading : recipesLoading}
              error={activeCategory.isAll ? referencesError : recipesError}
            />
          </div>
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
