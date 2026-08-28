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

const getTabFromSearchParams = (searchParams) => {
  const tabValue = searchParams.get("tab");

  return OWN_PROFILE_TABS.includes(tabValue) ? tabValue : "recipes";
};

const useUserProfileList = ({ profile, isOwnProfile }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => getTabFromSearchParams(searchParams));

  const [page, setPage] = useState(() => getPageFromSearchParams(searchParams));

  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const allowedTabs = isOwnProfile ? OWN_PROFILE_TABS : OTHER_PROFILE_TABS;

    const requestedTab = searchParams.get("tab");

    const normalizedTab = allowedTabs.includes(requestedTab) ? requestedTab : "recipes";

    const normalizedPage = getPageFromSearchParams(searchParams);

    if (activeTab !== normalizedTab) {
      setActiveTab(normalizedTab);
    }

    if (page !== normalizedPage) {
      setPage(normalizedPage);
    }

    const currentTabParam = searchParams.get("tab");
    const currentPageParam = searchParams.get("page");

    if (currentTabParam !== normalizedTab || currentPageParam !== String(normalizedPage)) {
      setSearchParams(
        {
          tab: normalizedTab,
          page: String(normalizedPage),
        },
        {
          replace: true,
        },
      );
    }
  }, [activeTab, isOwnProfile, page, profile, searchParams, setSearchParams]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) {
      return;
    }

    setIsPageTransitioning(false);
    setActiveTab(tabId);
    setPage(1);

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
    setPage(nextPage);

    setSearchParams({
      tab: activeTab,
      page: String(nextPage),
    });
  };

  const changePage = useCallback(
    (nextPage, options = {}) => {
      const { transitioning = true } = options;

      setIsPageTransitioning(transitioning);
      setPage(nextPage);

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
