import { createElement } from "react";
import { Link } from "react-router-dom";

const RecipePreview = ({
  recipe,
  activeTab,
  isOwnProfile,
  isDeleting,
  isDeleteBlocked,
  onDelete,
}) => {
  const recipeTitle = recipe.title || "Recipe";

  const recipeImage = recipe.image ? (
    createElement("img", {
      src: recipe.image,
      alt: recipeTitle,
      className: "h-full w-full object-cover",
      loading: "lazy",
      decoding: "async",
    })
  ) : (
    <div
      className="flex h-full w-full items-center justify-center bg-secondary"
      role="img"
      aria-label={`${recipeTitle} image is not available`}
    >
      <span className="px-[0.6rem] text-center text-[1rem] leading-[1.4rem] font-medium text-bg tablet:px-[1rem] tablet:text-[1.2rem] tablet:leading-[1.8rem]">
        No image
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

  const trashIcon = createElement(
    "svg",
    {
      "aria-hidden": true,
      className:
        "h-[1.6rem] w-[1.6rem] shrink-0 fill-none stroke-current text-primary tablet:h-[1.8rem] tablet:w-[1.8rem]",
    },
    createElement("use", {
      href: "/icons.svg#icon-trash",
    }),
  );

  const deleteLabel = activeTab === "favorites" ? "Remove from favorites" : "Delete recipe";

  const pendingDeleteLabel =
    activeTab === "favorites" ? "Removing from favorites" : "Deleting recipe";

  return (
    <article className="flex h-[7.5rem] w-full items-start gap-[1rem] tablet:h-[10rem] tablet:gap-[1.6rem]">
      <div className="h-[7.5rem] w-[7.5rem] shrink-0 overflow-hidden rounded-[1.5rem] tablet:h-[10rem] tablet:w-[10rem]">
        {recipeImage}
      </div>

      <div className="flex h-[7.5rem] min-w-0 flex-1 items-start gap-[1.6rem] tablet:h-[10rem] tablet:gap-[3.2rem]">
        <div className="flex h-[7.5rem] min-w-0 flex-1 flex-col items-start gap-[0.8rem] tablet:h-[10rem] tablet:gap-[1rem]">
          <h3 className="w-full truncate text-[1.6rem] leading-[2.4rem] font-extrabold uppercase text-accent tablet:text-[2rem]">
            {recipeTitle}
          </h3>

          <p className="line-clamp-2 w-full text-[1.4rem] leading-[2rem] font-medium text-secondary tablet:line-clamp-3 tablet:text-[1.6rem] tablet:leading-[2.4rem] tablet:text-primary">
            {recipe.description || "No description available."}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-[0.4rem]">
          <Link
            className="flex h-[3.6rem] w-[3.6rem] shrink-0 items-center justify-center rounded-[3rem] border border-secondary p-[1rem] text-accent transition-colors duration-100 hover:border-accent tablet:h-[4.2rem] tablet:w-[4.2rem] tablet:p-[1.2rem]"
            to={`/recipes/${recipe.id}`}
            aria-label={`Open ${recipeTitle}`}
          >
            {arrowIcon}
          </Link>

          {isOwnProfile && (
            <button
              className="flex h-[3.6rem] w-[3.6rem] shrink-0 items-center justify-center rounded-[3rem] border border-secondary p-[1rem] text-primary transition-colors duration-100 hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 tablet:h-[4.2rem] tablet:w-[4.2rem] tablet:p-[1.2rem]"
              type="button"
              aria-label={isDeleting ? pendingDeleteLabel : deleteLabel}
              disabled={isDeleteBlocked}
              onClick={() => onDelete(recipe.id)}
            >
              {trashIcon}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecipePreview;
