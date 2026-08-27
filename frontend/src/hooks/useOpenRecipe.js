import { useNavigate } from "react-router-dom";

import slugify from "../utils/slugify.js";

// shared by Home and Recipe pages to avoid duplicating the recipe-detail navigation
const useOpenRecipe = () => {
  const navigate = useNavigate();

  return (recipeId, title) => {
    const slug = title ? slugify(title) : "";

    navigate(slug ? `/recipes/${slug}-${recipeId}` : `/recipes/${recipeId}`);
  };
};

export default useOpenRecipe;
