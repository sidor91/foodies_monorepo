import { useState } from "react";
import { NavLink } from "react-router-dom";

const UserNav = ({ user, onAuthToggle }) => {
  const [isExtra, setIsExtra] = useState(false);

  const handleExtraToggle = () => {
    setIsExtra((prev) => !prev);
  };
  return (
    <div className="bg-primary rounded-[3rem] flex items-center relative">
      <div className="bg-secondary w-[3.2rem] h-[3.2rem] rounded-[3rem] tablet:w-20 tablet:h-20 "></div>
      <button
        type="button"
        onClick={handleExtraToggle}
        className="flex pl-[0.6rem] pr-[0.6rem] pt-[0.7rem] pb-[0.7rem] gap-[0.4rem] tablet:pr-[1.4rem]"
      >
        <p className="text-bg uppercase text-[1.2rem] font-bold">{user.userName}</p>
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
        <div className="absolute w-[12.2rem] bg-accent flex flex-col gap-[0.4rem] p-[1.6rem] mt-53 border border-secondary rounded-3xl tablet:w-[14.8rem]">
          <NavLink
            to="/profile"
            className="uppercase text-bg text-[1.2rem] leading-[150%] tracking-[-0.02em] font-bold"
            onClick={handleExtraToggle}
          >
            Profile
          </NavLink>
          <NavLink
            to="/logout"
            className="flex content-center"
            onClick={`${handleExtraToggle} ${onAuthToggle}`}
          >
            <p className="uppercase text-bg text-[1.2rem] leading-[150%] tracking-[-0.02em] font-bold">
              Log out
            </p>
            <svg className="fill-none stroke-bg w-[1.8rem] h-[1.8rem]">
              <use href="/icons.svg#icon-arrow-up-right" />
            </svg>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default UserNav;
