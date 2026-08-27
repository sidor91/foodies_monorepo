import { useState } from "react";
import { NavLink } from "react-router-dom";

const UserNav = ({ user, onLogout, isAddRecipePage }) => {
  const [isExtra, setIsExtra] = useState(false);

  const handleExtraToggle = () => {
    setIsExtra((prev) => !prev);
  };

  return (
    <div className="bg-primary rounded-[3rem] flex items-center relative">
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
        <p className="text-bg uppercase text-[1.2rem] font-bold">{user?.name || "username"}</p>
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
          className={`${isAddRecipePage && "bg-transparent"} absolute w-[12.2rem] bg-accent flex flex-col gap-[0.4rem] p-[1.6rem] mt-53 border border-secondary rounded-3xl tablet:w-[14.8rem]`}
        >
          <NavLink
            to={`/user/${user?.id}`}
            className={`${isAddRecipePage && "text-primary"} uppercase text-bg text-[1.2rem] leading-[150%] tracking-[-0.02em] font-bold`}
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
              className={`${isAddRecipePage && "text-primary"} uppercase text-bg text-[1.2rem] leading-[150%] tracking-[-0.02em] font-bold`}
            >
              Log out
            </p>
            <svg
              className={`${isAddRecipePage && "stroke-primary"} fill-none stroke-bg w-[1.8rem] h-[1.8rem]`}
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
