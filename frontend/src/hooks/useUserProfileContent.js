import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFavorites } from "../../redux/favorites/favoritesOps.js";
import {
  selectFavorites,
  selectFavoritesError,
  selectFavoritesIsLoading,
  selectFavoritesPagination,
} from "../../redux/favorites/favoritesSelectors.js";

import { fetchOwnRecipes, fetchRecipes } from "../../redux/recipes/recipesOps.js";
import {
  selectOwnRecipes,
  selectOwnRecipesPagination,
  selectRecipes,
  selectRecipesError,
  selectRecipesIsLoading,
  selectRecipesPagination,
} from "../../redux/recipes/recipesSelectors.js";

import { fetchFollowers, fetchFollowing } from "../../redux/users/usersOps.js";
import {
  selectFollowers,
  selectFollowersPagination,
  selectFollowing,
  selectFollowingPagination,
} from "../../redux/users/usersSelectors.js";

const PAGE_LIMIT = 12;
const FOLLOWING_IDS_LIMIT = 50;

const EMPTY_PAGINATION = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};

const useUserProfileContent = ({
  activeTab,
  page,
  profile,
  isOwnProfile,
  isUsersLoading,
  usersError,
  isPageTransitioning,
  setIsPageTransitioning,
  changePage,
}) => {
  const dispatch = useDispatch();

  const followers = useSelector(selectFollowers);
  const following = useSelector(selectFollowing);
  const followersPagination = useSelector(selectFollowersPagination);
  const followingPagination = useSelector(selectFollowingPagination);

  const recipes = useSelector(selectRecipes);
  const recipesPagination = useSelector(selectRecipesPagination);
  const ownRecipes = useSelector(selectOwnRecipes);
  const ownRecipesPagination = useSelector(selectOwnRecipesPagination);
  const isRecipesLoading = useSelector(selectRecipesIsLoading);
  const recipesError = useSelector(selectRecipesError);

  const favorites = useSelector(selectFavorites);
  const favoritesPagination = useSelector(selectFavoritesPagination);
  const isFavoritesLoading = useSelector(selectFavoritesIsLoading);
  const favoritesError = useSelector(selectFavoritesError);

  const items =
    activeTab === "recipes"
      ? isOwnProfile
        ? ownRecipes
        : recipes
      : activeTab === "favorites"
        ? favorites
        : activeTab === "followers"
          ? followers
          : activeTab === "following"
            ? following
            : [];

  const pagination =
    activeTab === "recipes"
      ? isOwnProfile
        ? ownRecipesPagination
        : recipesPagination
      : activeTab === "favorites"
        ? favoritesPagination
        : activeTab === "followers"
          ? followersPagination
          : activeTab === "following"
            ? followingPagination
            : EMPTY_PAGINATION;

  const isDataLoading =
    (activeTab === "recipes" && isRecipesLoading) ||
    (activeTab === "favorites" && isFavoritesLoading) ||
    (activeTab === "followers" && isUsersLoading) ||
    (activeTab === "following" && isUsersLoading);

  const listError =
    activeTab === "recipes"
      ? recipesError
      : activeTab === "favorites"
        ? favoritesError
        : activeTab === "followers" || activeTab === "following"
          ? usersError
          : null;

  const isListLoading = isPageTransitioning || isDataLoading;

  const shouldShowPagination = !listError && items.length > 0 && pagination.totalPages > 1;

  useEffect(() => {
    if (!profile) {
      return;
    }

    if (isOwnProfile && activeTab === "recipes") {
      dispatch(
        fetchOwnRecipes({
          page,
          limit: PAGE_LIMIT,
        }),
      );
    }

    if (!isOwnProfile && activeTab === "recipes") {
      dispatch(
        fetchRecipes({
          userId: profile.id,
          page,
          limit: PAGE_LIMIT,
        }),
      );
    }

    if (isOwnProfile && activeTab === "favorites") {
      dispatch(
        fetchFavorites({
          page,
          limit: PAGE_LIMIT,
        }),
      );
    }

    if (activeTab === "followers") {
      const loadFollowers = async () => {
        try {
          await dispatch(
            fetchFollowing({
              page: 1,
              limit: FOLLOWING_IDS_LIMIT,
            }),
          ).unwrap();

          await dispatch(
            fetchFollowers({
              userId: profile.id,
              page,
              limit: PAGE_LIMIT,
            }),
          ).unwrap();
        } catch {
          setIsPageTransitioning(false);
        }
      };

      loadFollowers();
    }

    if (isOwnProfile && activeTab === "following") {
      dispatch(
        fetchFollowing({
          page,
          limit: PAGE_LIMIT,
        }),
      );
    }
  }, [activeTab, dispatch, isOwnProfile, page, profile, setIsPageTransitioning]);

  useEffect(() => {
    if (!isPageTransitioning) {
      return;
    }

    const requestedPageLoaded = !isDataLoading && pagination.page === page;

    if (requestedPageLoaded || listError) {
      setIsPageTransitioning(false);
    }
  }, [
    isDataLoading,
    isPageTransitioning,
    listError,
    page,
    pagination.page,
    setIsPageTransitioning,
  ]);

  useEffect(() => {
    if (isDataLoading || pagination.totalPages <= 0 || page <= pagination.totalPages) {
      return;
    }

    changePage(pagination.totalPages);
  }, [changePage, isDataLoading, page, pagination.totalPages]);

  return {
    items,
    pagination,
    isDataLoading,
    listError,
    isListLoading,
    shouldShowPagination,
  };
};

export default useUserProfileContent;
