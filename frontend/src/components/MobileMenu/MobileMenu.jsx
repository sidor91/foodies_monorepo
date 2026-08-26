import { NavLink } from "react-router-dom";
import clsx from "clsx";

import css from "./MobileMenu.module.css";

const buildLinkClass = ({ isActive }) => {
  return clsx(css.nav__link, isActive && css.active);
};

const MobileMenu = ({ isMobileMenuOpen, onMobileToggle }) => {
  return (
    <div className={`${css.modal__overlay} ${isMobileMenuOpen ? css.is__open : ""}`}>
      <div className={css.modal}>
        <div className="flex items-center justify-between w-full">
          <NavLink
            to="/"
            className="text-bg text-[2rem] leading-[120%] tracking-[-0.02em] font-extrabold tablet:text-[2.4rem] tablet:leading-[160%]"
          >
            foodies
          </NavLink>

          <button type="button" className="" onClick={onMobileToggle} aria-label="Close Modal">
            <svg className="w-[2.4rem] h-[2.4rem] fill-none stroke-bg">
              <use href="/icons.svg#icon-close" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-center gap-[1.6rem] w-full flex-1 justify-center">
          <NavLink to="/" className={buildLinkClass} onClick={onMobileToggle}>
            Home
          </NavLink>
          <NavLink to="/add-recipe" className={buildLinkClass} onClick={onMobileToggle}>
            Add Recipe
          </NavLink>
        </nav>

        <div className="flex items-center justify-center w-full pb-30">
          <img
            className="w-[7.7rem] h-28"
            src={`/mobileMenu/mobile-small.webp`}
            srcSet={`/mobileMenu/mobile-small.webp 1x, /mobileMenu/mobile-small@2x.webp 2x`}
            alt="Tiramisu dish"
          />
          <img
            className="w-76 h-[17.2rem]"
            src={`/mobileMenu/mobile-large.webp`}
            srcSet={`/mobileMenu/mobile-large.webp 1x, /mobileMenu/mobile-large@2x.webp 2x`}
            alt="Dish with meat roll"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
