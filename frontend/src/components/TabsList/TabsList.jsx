const OWN_PROFILE_TABS = [
  { id: "recipes", label: "My recipes" },
  { id: "favorites", label: "My favorites" },
  { id: "followers", label: "Followers" },
  { id: "following", label: "Following" },
];

const OTHER_PROFILE_TABS = [
  { id: "recipes", label: "Recipes" },
  { id: "followers", label: "Followers" },
];

const TabsList = ({ activeTab, isOwnProfile, onTabChange }) => {
  const tabs = isOwnProfile ? OWN_PROFILE_TABS : OTHER_PROFILE_TABS;

  return (
    <div className="w-full overflow-hidden border-b border-secondary">
      <div className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden tablet:overflow-x-visible">
        <ul className="flex min-w-max items-start gap-[3rem] tablet:gap-[4rem]">
          {tabs.map(({ id, label }) => {
            const isActive = activeTab === id;

            return (
              <li key={id} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={isActive}
                  className={`relative pb-[1.4rem] text-[1.8rem] leading-[2.4rem] font-extrabold tracking-[-0.02em] whitespace-nowrap uppercase transition-colors tablet:text-[2rem] ${
                    isActive
                      ? "text-accent after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-[3px] after:bg-accent after:content-['']"
                      : "text-secondary"
                  }`}
                  onClick={() => onTabChange(id)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TabsList;
