import useUserProfileActions from "../../hooks/useUserProfileActions.js";
import useUserProfileContent from "../../hooks/useUserProfileContent.js";
import useUserProfileData from "../../hooks/useUserProfileData.js";
import useUserProfileList from "../../hooks/useUserProfileList.js";

import ListItems from "../../components/ListItems/ListItems.jsx";
import ListPagination from "../../components/ListPagination/ListPagination.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import PathInfo from "../../components/PathInfo/PathInfo.jsx";
import Subtitle from "../../components/Subtitle/Subtitle.jsx";
import TabsList from "../../components/TabsList/TabsList.jsx";
import UserInfo from "../../components/UserInfo/UserInfo.jsx";

const UserProfile = ({ onLogout }) => {
  const {
    profile,
    isOwnProfile,
    isWaitingForProfile,
    profileErrorMessage,
    isUsersLoading,
    usersError,
  } = useUserProfileData();

  const {
    activeTab,
    page,
    isPageTransitioning,
    setIsPageTransitioning,
    handleTabChange: changeTab,
    handlePageChange: selectPage,
    changePage,
  } = useUserProfileList({
    profile,
    isOwnProfile,
  });

  const { items, pagination, isDataLoading, listError, isListLoading, shouldShowPagination } =
    useUserProfileContent({
      activeTab,
      page,
      profile,
      isOwnProfile,
      isUsersLoading,
      usersError,
      isPageTransitioning,
      setIsPageTransitioning,
      changePage,
    });

  const { deletingRecipeId, handleDelete, handleProfileFollowChange } = useUserProfileActions({
    activeTab,
    profile,
    page,
    itemsCount: items.length,
    changePage,
    setIsPageTransitioning,
  });

  const handleTabChange = (tabId) => {
    if (deletingRecipeId) {
      return;
    }

    changeTab(tabId);
  };

  const handlePageChange = (nextPage) => {
    if (deletingRecipeId) {
      return;
    }

    selectPage(nextPage);
  };

  if (isWaitingForProfile) {
    return (
      <section className="section">
        <div className="container flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="section">
        <div className="container">
          <p
            className="text-[1.4rem] leading-[2rem] text-error tablet:text-[1.6rem] tablet:leading-[2.4rem]"
            role="alert"
          >
            {profileErrorMessage}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="flex w-full flex-col items-start gap-[3.2rem] tablet:gap-[4rem] desktop:w-[128rem]">
          <div className="flex w-full flex-col items-start gap-[3.2rem] tablet:w-[44.3rem] tablet:gap-[4rem]">
            <PathInfo currentPage="Profile" />

            <div className="flex w-full flex-col items-start gap-[1.6rem] tablet:w-[44.3rem] tablet:gap-[2rem]">
              <MainTitle>Profile</MainTitle>

              <Subtitle muted={activeTab !== "recipes"} />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[6.4rem] tablet:w-[70.4rem] tablet:gap-[8rem] desktop:w-[128rem] desktop:flex-row desktop:items-start desktop:gap-[4rem]">
            <UserInfo
              profile={profile}
              isOwnProfile={isOwnProfile}
              onLogout={onLogout}
              onFollowChange={handleProfileFollowChange}
            />

            <div className="flex w-full min-w-0 flex-col items-start gap-[3.2rem] tablet:w-[70.4rem] tablet:gap-[4rem] desktop:w-[84.6rem]">
              <TabsList
                activeTab={activeTab}
                isOwnProfile={isOwnProfile}
                onTabChange={handleTabChange}
              />

              <div className="flex w-full flex-col items-center gap-[3rem] tablet:gap-[6rem]">
                {isDataLoading && !isPageTransitioning ? (
                  <Loader />
                ) : (
                  <div className="relative w-full">
                    <ListItems
                      items={items}
                      activeTab={activeTab}
                      isOwnProfile={isOwnProfile}
                      deletingRecipeId={deletingRecipeId}
                      onDelete={handleDelete}
                    />

                    {isPageTransitioning && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/70">
                        <Loader />
                      </div>
                    )}
                  </div>
                )}

                {!isListLoading && listError && (
                  <p
                    className="text-center text-[1.4rem] leading-[2rem] text-error tablet:text-[1.6rem] tablet:leading-[2.4rem]"
                    role="alert"
                  >
                    {listError}
                  </p>
                )}

                {shouldShowPagination && (
                  <div className={isPageTransitioning ? "pointer-events-none opacity-60" : ""}>
                    <ListPagination
                      page={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
