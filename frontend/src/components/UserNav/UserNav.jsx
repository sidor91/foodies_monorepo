import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import useIsRoute from "../../hooks/useIsRoute.js";
import { selectUser } from "../../../redux/auth/authSelectors.js";

const UserNav = ({ onLogout }) => {
  const [isExtra, setIsExtra] = useState(false);
  const userNavRef = useRef(null);

  const user = useSelector(selectUser);

  const isHomePage = useIsRoute("/");
  const isCategoriesPage = useIsRoute("/categories");
  const isHomePageOrCategories = isHomePage || isCategoriesPage;

  const handleExtraToggle = () => {
    setIsExtra((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userNavRef.current && !userNavRef.current.contains(event.target)) {
        setIsExtra(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={userNavRef} className="bg-primary rounded-[3rem] flex items-center relative">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={`${user.name} profile photo`}
          className="w-[3.2rem] h-[3.2rem] rounded-[3rem] object-cover tablet:w-20 tablet:h-20"
        />
      ) : (
        <div className="bg-secondary w-[3.2rem] h-[3.2rem] rounded-[3rem] flex items-center justify-center tablet:w-20 tablet:h-20">
          {user?.name && (
            <span className="text-bg uppercase text-[2.4rem] font-bold">{user.name.charAt(0)}</span>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={handleExtraToggle}
        className="flex pl-[0.6rem] pr-[0.6rem] pt-[0.7rem] pb-[0.7rem] gap-[0.4rem] tablet:pr-[1.4rem]"
      >
        <p className="text-bg uppercase text-[1.2rem] font-bold">{user?.name}</p>
        {!isExtra ? (
          <svg className="stroke-bg fill-none w-[1.8rem] h-[1.8rem]">
            <use href="/icons.svg#icon-arrow-down" />
          </svg>
        ) : (
          <svg className="stroke-bg fill-none w-[1.8rem] h-[1.8rem]">
            <use href="/icons.svg#icon-arrow-up" />
          </svg>
        )}
      </button>

      {isExtra && (
        <div
          className={`${!isHomePageOrCategories && "bg-bg"} absolute top-full right-0 z-20 mt-[0.53rem] w-[12.2rem] bg-accent flex flex-col gap-[0.4rem] p-[1.6rem] border border-secondary rounded-3xl tablet:w-[14.8rem]`}
        >
          <NavLink
            to={`/user/${user?.id}`}
            className={`${!isHomePageOrCategories && "text-primary"} uppercase text-bg text-[1.2rem] leading-[150%] tracking-[-0.02em] font-bold`}
            onClick={handleExtraToggle}
          >
            Profile
          </NavLink>
          <button
            type="button"
            className="flex content-center"
            onClick={() => {
              handleExtraToggle();
              onLogout();
            }}
          >
            <p
              className={`${!isHomePageOrCategories && "text-primary"} uppercase text-bg text-[1.2rem] leading-[150%] tracking-[-0.02em] font-bold`}
            >
              Log out
            </p>
            <svg
              className={`${!isHomePageOrCategories && "stroke-primary"} fill-none stroke-bg w-[1.8rem] h-[1.8rem]`}
            >
              <use href="/icons.svg#icon-arrow-up-right" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNav;
