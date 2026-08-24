import { useNavigate } from "react-router-dom";

// shared by Home and Recipe pages to avoid duplicating the recipe-detail navigation
const useOpenRecipe = () => {
  const navigate = useNavigate();

  return (recipeId) => navigate(`/recipes/${recipeId}`);
};

export default useOpenRecipe;
