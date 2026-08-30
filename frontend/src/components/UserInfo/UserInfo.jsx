import { createElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { refreshUser, updateAvatar } from "../../../redux/auth/authOps.js";
import { followUser, unfollowUser } from "../../../redux/users/usersOps.js";
import { selectIsFollowing, selectIsFollowPending } from "../../../redux/users/usersSelectors.js";
import { selectFavoriteIds } from "../../../redux/favorites/favoritesSelectors.js";

const getErrorText = (error, fallbackMessage) => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const UserInfo = ({ profile, isOwnProfile, onLogout, onFollowChange }) => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavoriteIds);

  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const isFollowing = useSelector(selectIsFollowing(profile.id));
  const isFollowPending = useSelector(selectIsFollowPending(profile.id));

  const avatarInitial = profile.name?.charAt(0).toUpperCase() || "?";

  const handleAvatarChange = async (event) => {
    const input = event.target;
    const avatarFile = input.files?.[0];

    if (!avatarFile || isAvatarUploading) {
      input.value = "";
      return;
    }

    setIsAvatarUploading(true);

    try {
      await dispatch(updateAvatar(avatarFile)).unwrap();
      toast.success("Avatar updated successfully.");
    } catch (error) {
      toast.error(getErrorText(error, "Failed to update the avatar."));
    } finally {
      input.value = "";
      setIsAvatarUploading(false);
    }
  };

  const handleFollowToggle = async () => {
    const action = isFollowing ? "unfollow" : "follow";

    try {
      if (action === "unfollow") {
        await dispatch(unfollowUser(profile.id)).unwrap();
      } else {
        await dispatch(followUser(profile.id)).unwrap();
      }

      await dispatch(refreshUser()).unwrap();

      toast.success(
        action === "unfollow"
          ? `You unfollowed ${profile.name}.`
          : `You are now following ${profile.name}.`,
      );

      await onFollowChange?.(action);
    } catch (error) {
      const fallbackMessage =
        action === "unfollow"
          ? `Failed to unfollow ${profile.name}.`
          : `Failed to follow ${profile.name}.`;

      toast.error(getErrorText(error, fallbackMessage));
    }
  };

  const avatar = profile.avatarUrl ? (
    createElement("img", {
      src: profile.avatarUrl,
      alt: `${profile.name} avatar`,
      className: "h-full w-full object-cover",
    })
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <span className="text-[2.8rem] leading-[3.2rem] font-extrabold text-bg tablet:text-[4rem] tablet:leading-[4.4rem]">
        {avatarInitial}
      </span>
    </div>
  );

  return (
    <aside className="flex w-full flex-col items-start gap-[2rem] tablet:w-[39.4rem]">
      <div className="flex h-[32rem] w-full flex-col items-center gap-[1.6rem] rounded-[3rem] border border-secondary px-[5.4rem] py-[3rem] tablet:h-[40.8rem] tablet:w-[39.4rem] tablet:gap-[2rem] tablet:px-[8rem] tablet:py-[4rem]">
        <div className="relative">
          <div className="h-[8rem] w-[8rem] overflow-hidden rounded-full tablet:h-[12rem] tablet:w-[12rem]">
            {avatar}

            {isAvatarUploading && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/60"
                role="status"
                aria-live="polite"
                aria-label="Uploading avatar"
              >
                <span className="h-[2.4rem] w-[2.4rem] animate-spin rounded-full border-[0.3rem] border-bg/40 border-t-bg tablet:h-[3.2rem] tablet:w-[3.2rem]" />
              </div>
            )}
          </div>

          {isOwnProfile && (
            <label
              className={`absolute bottom-[-0.8rem] left-1/2 flex h-[2.8rem] w-[2.8rem] -translate-x-1/2 items-center justify-center rounded-full bg-accent text-bg tablet:bottom-[-1rem] tablet:h-[3.8rem] tablet:w-[3.8rem] ${
                isAvatarUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
              aria-label={isAvatarUploading ? "Avatar is uploading" : "Upload avatar"}
            >
              <span className="text-[1.6rem] leading-none font-medium tablet:text-[1.8rem]">+</span>

              <input
                className="visually__hidden"
                type="file"
                name="avatar"
                accept="image/jpeg,image/png,image/webp"
                disabled={isAvatarUploading}
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>

        <h2 className="max-w-full truncate text-center text-[1.8rem] leading-[2.4rem] font-extrabold tracking-[-0.02em] uppercase text-accent tablet:text-[2rem] tablet:leading-[2.4rem]">
          {profile.name}
        </h2>

        <div className="flex w-[20.5rem] flex-col items-start gap-[0.6rem] tablet:w-[23.4rem]">
          <div className="flex w-full items-center gap-[0.8rem]">
            <span className="shrink-0 text-[1.2rem] leading-[1.8rem] font-medium text-secondary tablet:text-[1.4rem] tablet:leading-[2rem]">
              Email:
            </span>

            <strong className="min-w-0 truncate text-[1.4rem] leading-[2rem] font-bold text-primary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
              {profile.email}
            </strong>
          </div>

          <div className="flex w-full items-center gap-[0.8rem]">
            <span className="shrink-0 text-[1.2rem] leading-[1.8rem] font-medium text-secondary tablet:text-[1.4rem] tablet:leading-[2rem]">
              Added recipes:
            </span>

            <strong className="text-[1.4rem] leading-[2rem] font-bold text-primary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
              {profile.recipesCount}
            </strong>
          </div>

          {isOwnProfile && (
            <div className="flex w-full items-center gap-[0.8rem]">
              <span className="shrink-0 text-[1.2rem] leading-[1.8rem] font-medium text-secondary tablet:text-[1.4rem] tablet:leading-[2rem]">
                Favorites:
              </span>

              <strong className="text-[1.4rem] leading-[2rem] font-bold text-primary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
                {favoriteIds?.length || 0}
              </strong>
            </div>
          )}

          <div className="flex w-full items-center gap-[0.8rem]">
            <span className="shrink-0 text-[1.2rem] leading-[1.8rem] font-medium text-secondary tablet:text-[1.4rem] tablet:leading-[2rem]">
              Followers:
            </span>

            <strong className="text-[1.4rem] leading-[2rem] font-bold text-primary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
              {profile.followersCount}
            </strong>
          </div>

          {isOwnProfile && (
            <div className="flex w-full items-center gap-[0.8rem]">
              <span className="shrink-0 text-[1.2rem] leading-[1.8rem] font-medium text-secondary tablet:text-[1.4rem] tablet:leading-[2rem]">
                Following:
              </span>

              <strong className="text-[1.4rem] leading-[2rem] font-bold text-primary tablet:text-[1.6rem] tablet:leading-[2.4rem]">
                {profile.followingCount}
              </strong>
            </div>
          )}
        </div>
      </div>

      {isOwnProfile ? (
        <button
          type="button"
          onClick={onLogout}
          className="btn flex h-[4.8rem] w-full items-center justify-center !bg-primary !text-bg tablet:h-[5.6rem] tablet:w-[39.4rem]"
        >
          Log out
        </button>
      ) : (
        <button
          type="button"
          disabled={isFollowPending}
          onClick={handleFollowToggle}
          className="btn btn__primary flex h-[4.8rem] w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-60 tablet:h-[5.6rem] tablet:w-[39.4rem]"
        >
          {isFollowPending ? "Updating..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </aside>
  );
};

export default UserInfo;
