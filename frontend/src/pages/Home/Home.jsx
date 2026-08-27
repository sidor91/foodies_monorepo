import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../../../redux/references/referencesOps.js";
import {
  selectCategories,
  selectReferencesError,
  selectReferencesIsLoading,
} from "../../../redux/references/referencesSelectors.js";
import { Category, Categories, Hero, Testimonials } from "../../components/index.js";
import slugify from "../../utils/slugify.js";

import css from "./Home.module.css";

const Home = ({ onRequireLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const categories = useSelector(selectCategories);
  const referencesLoading = useSelector(selectReferencesIsLoading);
  const referencesError = useSelector(selectReferencesError);

  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const selectedCategory = useMemo(() => {
    if (!categorySlug) {
      return null;
    }

    return categories.find((category) => slugify(category.name) === categorySlug) || null;
  }, [categories, categorySlug]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
  };

  return (
    <div className={css.home}>
      <Hero />

      <div className={css.categoriesSwitcher}>
        {selectedCategory ? (
          <Category
            category={selectedCategory}
            onBack={handleBackFromCategory}
            onRequireLogin={onRequireLogin}
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

      <Testimonials />
    </div>
  );
};

export default Home;
