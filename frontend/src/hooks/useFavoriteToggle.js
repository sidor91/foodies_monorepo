import { useDispatch } from "react-redux";

import { addFavorite, removeFavorite } from "../../redux/favorites/favoritesOps.js";

// shared by Home and Recipe pages to avoid duplicating the auth-guarded toggle logic
const useFavoriteToggle = ({ favoriteIds, isAuthenticated, onRequireLogin }) => {
  const dispatch = useDispatch();

  return (recipeId) => {
    if (!isAuthenticated) {
      onRequireLogin?.();
      return;
    }

    dispatch(favoriteIds.includes(recipeId) ? removeFavorite(recipeId) : addFavorite(recipeId));
  };
};

export default useFavoriteToggle;
