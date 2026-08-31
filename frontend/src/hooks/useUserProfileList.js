import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const OWN_PROFILE_TABS = ["recipes", "favorites", "followers", "following"];
const OTHER_PROFILE_TABS = ["recipes", "followers"];

const getPageFromSearchParams = (searchParams) => {
  const pageValue = Number(searchParams.get("page"));

  if (!Number.isInteger(pageValue) || pageValue < 1) {
    return 1;
  }

  return pageValue;
};

const getTabFromSearchParams = (searchParams, allowedTabs) => {
  const tabValue = searchParams.get("tab");

  return allowedTabs.includes(tabValue) ? tabValue : "recipes";
};

const useUserProfileList = ({ profile, isOwnProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  const allowedTabs = isOwnProfile ? OWN_PROFILE_TABS : OTHER_PROFILE_TABS;

  const activeTab = getTabFromSearchParams(searchParams, allowedTabs);
  const page = getPageFromSearchParams(searchParams);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const currentTabParam = searchParams.get("tab");
    const currentPageParam = searchParams.get("page");

    if (currentTabParam !== activeTab || currentPageParam !== String(page)) {
      setSearchParams(
        {
          tab: activeTab,
          page: String(page),
        },
        {
          replace: true,
        },
      );
    }
  }, [activeTab, page, profile, searchParams, setSearchParams]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) {
      return;
    }

    setIsPageTransitioning(false);

    setSearchParams({
      tab: tabId,
      page: "1",
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage === page) {
      return;
    }

    setIsPageTransitioning(true);

    setSearchParams({
      tab: activeTab,
      page: String(nextPage),
    });
  };

  const changePage = useCallback(
    (nextPage, options = {}) => {
      const { transitioning = true } = options;

      setIsPageTransitioning(transitioning);

      setSearchParams({
        tab: activeTab,
        page: String(nextPage),
      });
    },
    [activeTab, setSearchParams],
  );

  return {
    activeTab,
    page,
    isPageTransitioning,
    setIsPageTransitioning,
    handleTabChange,
    handlePageChange,
    changePage,
  };
};

export default useUserProfileList;
