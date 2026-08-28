import RecipePreview from "../RecipePreview/RecipePreview.jsx";
import UserCard from "../UserCard/UserCard.jsx";

const RECIPE_TABS = ["recipes", "favorites"];
const USER_TABS = ["followers", "following"];

const OWN_PROFILE_EMPTY_MESSAGES = {
  recipes:
    "Nothing has been added to your recipes list yet. Create and publish a recipe to see it here.",
  favorites:
    "Nothing has been added to your favorite recipes list yet. Browse our recipes and add your favorites for easy access in the future.",
  followers:
    "There are currently no followers on your account. Share interesting recipes and draw attention to your profile.",
  following:
    "Your account currently has no subscriptions to other users. Explore other profiles and follow users whose content interests you.",
};

const OTHER_PROFILE_EMPTY_MESSAGES = {
  recipes: "This user has not added any recipes yet.",
  followers: "This user does not have any followers yet.",
};

const ListItems = ({ items, activeTab, isOwnProfile, deletingRecipeId, onDelete }) => {
  if (!items.length) {
    const emptyMessages = isOwnProfile ? OWN_PROFILE_EMPTY_MESSAGES : OTHER_PROFILE_EMPTY_MESSAGES;

    return (
      <div className="flex w-full justify-center py-[3rem] tablet:py-[4rem]">
        <p className="max-w-[60rem] text-center text-[1.4rem] leading-[2rem] font-medium text-secondary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
          {emptyMessages[activeTab] || "No items found."}
        </p>
      </div>
    );
  }

  if (RECIPE_TABS.includes(activeTab)) {
    return (
      <ul className="flex w-full flex-col gap-[3.2rem] tablet:gap-[4rem]">
        {items.map((recipe) => (
          <li key={recipe.id} className="w-full">
            <RecipePreview
              recipe={recipe}
              activeTab={activeTab}
              isOwnProfile={isOwnProfile}
              isDeleting={deletingRecipeId === recipe.id}
              isDeleteBlocked={Boolean(deletingRecipeId)}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    );
  }

  if (USER_TABS.includes(activeTab)) {
    return (
      <ul className="flex w-full flex-col">
        {items.map((user) => (
          <li
            key={user.id}
            className="w-full border-b border-secondary pb-[2rem] not-last:mb-[2rem] tablet:pb-[4rem] tablet:not-last:mb-[4rem]"
          >
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    );
  }

  return null;
};

export default ListItems;
