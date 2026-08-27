import { createElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { refreshUser } from "../../../redux/auth/authOps.js";
import { selectUser } from "../../../redux/auth/authSelectors.js";
import { followUser, unfollowUser } from "../../../redux/users/usersOps.js";
import { selectIsFollowing, selectIsFollowPending } from "../../../redux/users/usersSelectors.js";

const PREVIEW_LIMIT = 4;

const getErrorText = (error, fallbackMessage) => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectUser);
  const isFollowing = useSelector(selectIsFollowing(user.id));
  const isFollowPending = useSelector(selectIsFollowPending(user.id));

  const isCurrentUser = currentUser?.id === user.id;
  const avatarInitial = user.name?.charAt(0).toUpperCase() || "?";
  const recipesCount = Number(user.recipesCount) || 0;

  const recipes = Array.isArray(user.recipes)
    ? user.recipes.filter((recipe) => recipe.image).slice(0, PREVIEW_LIMIT)
    : [];

  const hasRecipePreviews = recipes.length > 0;

  const avatar = user.avatarUrl ? (
    createElement("img", {
      src: user.avatarUrl,
      alt: `${user.name} avatar`,
      className: "h-full w-full object-cover",
    })
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <span className="text-[2rem] leading-[2.4rem] font-extrabold uppercase text-bg tablet:text-[2.8rem] tablet:leading-[3.2rem]">
        {avatarInitial}
      </span>
    </div>
  );

  const arrowIcon = createElement(
    "svg",
    {
      "aria-hidden": true,
      className:
        "h-[1.6rem] w-[1.6rem] shrink-0 fill-none stroke-current text-accent tablet:h-[1.8rem] tablet:w-[1.8rem]",
    },
    createElement("use", {
      href: "/icons.svg#icon-arrow-up-right",
    }),
  );

  const handleFollowToggle = async () => {
    if (isCurrentUser) {
      return;
    }

    const action = isFollowing ? "unfollow" : "follow";

    try {
      if (action === "unfollow") {
        await dispatch(unfollowUser(user.id)).unwrap();
      } else {
        await dispatch(followUser(user.id)).unwrap();
      }

      await dispatch(refreshUser()).unwrap();

      toast.success(
        action === "unfollow"
          ? `You unfollowed ${user.name}.`
          : `You are now following ${user.name}.`,
      );
    } catch (error) {
      const fallbackMessage =
        action === "unfollow"
          ? `Failed to unfollow ${user.name}.`
          : `Failed to follow ${user.name}.`;

      toast.error(getErrorText(error, fallbackMessage));
    }
  };

  return (
    <article className="flex h-[9rem] w-full items-start justify-between tablet:h-[10rem] tablet:w-[70.4rem] tablet:justify-start tablet:gap-[6rem] desktop:w-[84.6rem] desktop:gap-[7.5rem]">
      <div className="flex h-[9rem] min-w-0 items-start gap-[1.6rem] tablet:h-[10rem] tablet:w-[21.7rem] tablet:shrink-0">
        <div className="h-[6rem] w-[6rem] shrink-0 overflow-hidden rounded-full tablet:h-[8.5rem] tablet:w-[8.5rem]">
          {avatar}
        </div>

        <div className="flex h-[9rem] min-w-0 flex-col items-start gap-[0.8rem] tablet:h-[10rem] tablet:w-[11.6rem]">
          <div className="flex min-w-0 flex-col items-start gap-[0.4rem]">
            <h3 className="max-w-[9.4rem] truncate text-[1.6rem] leading-[2.4rem] font-extrabold tracking-[-0.02em] uppercase text-accent tablet:max-w-[11.6rem] tablet:text-[2rem]">
              {user.name}
            </h3>

            <p className="whitespace-nowrap text-[1.2rem] leading-[1.8rem] font-medium text-secondary tablet:text-[1.4rem] tablet:leading-[2rem]">
              Own recipes: {recipesCount}
            </p>
          </div>

          {!isCurrentUser && (
            <button
              type="button"
              className="flex h-[3.6rem] w-[9.2rem] shrink-0 items-center justify-center rounded-[3rem] border border-secondary px-[1.6rem] py-[0.8rem] text-[1.4rem] leading-[2rem] font-bold tracking-[-0.02em] whitespace-nowrap uppercase text-primary transition-colors duration-100 hover:border-primary disabled:cursor-not-allowed disabled:opacity-60 tablet:h-[4.4rem] tablet:w-[11.6rem] tablet:px-[2.4rem] tablet:py-[1rem] tablet:text-[1.6rem] tablet:leading-[2.4rem]"
              disabled={isFollowPending}
              onClick={handleFollowToggle}
            >
              {isFollowPending ? "Updating..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div
        className="hidden h-[10rem] items-start gap-[1.2rem] tablet:flex tablet:w-[32.4rem] tablet:shrink-0 desktop:w-[43.6rem]"
        aria-label="Recipe previews"
      >
        {!hasRecipePreviews ? (
          <p className="text-[1.4rem] leading-[2rem] font-medium text-secondary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
            {recipesCount === 0
              ? "Nothing has been added to the user's recipe list yet."
              : "Recipe previews are not available."}
          </p>
        ) : (
          recipes.map((recipe, index) => {
            const recipeTitle = recipe.title || `recipe ${index + 1}`;

            const previewImage = createElement("img", {
              src: recipe.image,
              alt: recipeTitle,
              className: "h-full w-full object-cover",
              loading: "lazy",
              decoding: "async",
            });

            return (
              <Link
                key={recipe.id}
                className="h-[10rem] w-[10rem] shrink-0 overflow-hidden rounded-[1.5rem] [&:nth-child(4)]:hidden desktop:[&:nth-child(4)]:block"
                to={`/recipe/${recipe.id}`}
                aria-label={`Open ${recipeTitle} by ${user.name}`}
              >
                {previewImage}
              </Link>
            );
          })
        )}
      </div>

      <Link
        className="flex h-[3.6rem] w-[3.6rem] shrink-0 items-center justify-center rounded-[3rem] border border-secondary p-[1rem] text-accent transition-colors duration-100 hover:border-accent tablet:h-[4.2rem] tablet:w-[4.2rem] tablet:p-[1.2rem]"
        to={`/user/${user.id}`}
        aria-label={`Open ${user.name} profile`}
      >
        {arrowIcon}
      </Link>
    </article>
  );
};

export default UserCard;
