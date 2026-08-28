import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import { refreshUser } from "../../redux/auth/authOps.js";
import { fetchFavorites, removeFavorite } from "../../redux/favorites/favoritesOps.js";
import { deleteRecipe, fetchOwnRecipes } from "../../redux/recipes/recipesOps.js";
import { fetchFollowers, fetchFollowing } from "../../redux/users/usersOps.js";

const PAGE_LIMIT = 12;
const FOLLOWING_IDS_LIMIT = 50;

const getErrorText = (error, fallbackMessage) => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const useUserProfileActions = ({
  activeTab,
  profile,
  page,
  itemsCount,
  changePage,
  setIsPageTransitioning,
}) => {
  const dispatch = useDispatch();

  const [deletingRecipeId, setDeletingRecipeId] = useState(null);

  const handleProfileFollowChange = async () => {
    if (activeTab !== "followers" || !profile) {
      return;
    }

    try {
      setIsPageTransitioning(true);

      await dispatch(
        fetchFollowing({
          page: 1,
          limit: FOLLOWING_IDS_LIMIT,
        }),
      ).unwrap();

      const followersResponse = await dispatch(
        fetchFollowers({
          userId: profile.id,
          page,
          limit: PAGE_LIMIT,
        }),
      ).unwrap();

      if (page > 1 && followersResponse.items.length === 0) {
        changePage(page - 1);
        return;
      }

      setIsPageTransitioning(false);
    } catch (error) {
      setIsPageTransitioning(false);

      toast.error(
        getErrorText(
          error,
          "Follow status was updated, but the followers list could not be refreshed.",
        ),
      );
    }
  };

  const handleDelete = async (recipeId) => {
    if (deletingRecipeId) {
      return;
    }

    if (activeTab !== "recipes" && activeTab !== "favorites") {
      return;
    }

    setDeletingRecipeId(recipeId);

    const targetPage = itemsCount === 1 && page > 1 ? page - 1 : page;
    const isFavoritesTab = activeTab === "favorites";

    try {
      if (isFavoritesTab) {
        await dispatch(removeFavorite(recipeId)).unwrap();
        toast.success("Recipe removed from favorites.");
      } else {
        await dispatch(deleteRecipe(recipeId)).unwrap();
        toast.success("Recipe deleted successfully.");
      }
    } catch (error) {
      const fallbackMessage = isFavoritesTab
        ? "Failed to remove the recipe from favorites."
        : "Failed to delete the recipe.";

      toast.error(getErrorText(error, fallbackMessage));
      setDeletingRecipeId(null);
      return;
    }

    if (targetPage !== page) {
      changePage(targetPage);
    }

    try {
      await dispatch(refreshUser()).unwrap();

      if (targetPage === page) {
        if (isFavoritesTab) {
          await dispatch(
            fetchFavorites({
              page: targetPage,
              limit: PAGE_LIMIT,
            }),
          ).unwrap();
        } else {
          await dispatch(
            fetchOwnRecipes({
              page: targetPage,
              limit: PAGE_LIMIT,
            }),
          ).unwrap();
        }
      }
    } catch (error) {
      toast.error(
        getErrorText(
          error,
          "The recipe list was updated, but the profile data could not be refreshed.",
        ),
      );
    } finally {
      setDeletingRecipeId(null);
    }
  };

  return {
    deletingRecipeId,
    handleDelete,
    handleProfileFollowChange,
  };
};

export default useUserProfileActions;
