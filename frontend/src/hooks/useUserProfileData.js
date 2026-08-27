import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { selectIsRefreshing, selectUser } from "../../redux/auth/authSelectors.js";
import { fetchUserById } from "../../redux/users/usersOps.js";
import {
  selectProfile,
  selectUsersError,
  selectUsersIsLoading,
} from "../../redux/users/usersSelectors.js";

const getErrorText = (error, fallbackMessage) => {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const useUserProfileData = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectUser);
  const isRefreshing = useSelector(selectIsRefreshing);

  const otherUserProfile = useSelector(selectProfile);
  const isUsersLoading = useSelector(selectUsersIsLoading);
  const usersError = useSelector(selectUsersError);

  const isOwnProfile = currentUser?.id === id;

  const matchedOtherUserProfile = otherUserProfile?.id === id ? otherUserProfile : null;

  const profile = isOwnProfile ? currentUser : matchedOtherUserProfile;

  const isWaitingForProfile =
    !profile &&
    (isRefreshing || isUsersLoading || (!isOwnProfile && Boolean(currentUser) && !usersError));

  const profileErrorMessage = getErrorText(usersError, "User profile not found.");

  useEffect(() => {
    if (!id || !currentUser || isOwnProfile) {
      return;
    }

    if (otherUserProfile?.id !== id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, currentUser, id, isOwnProfile, otherUserProfile?.id]);

  return {
    profile,
    isOwnProfile,
    isWaitingForProfile,
    profileErrorMessage,
    isUsersLoading,
    usersError,
  };
};

export default useUserProfileData;
