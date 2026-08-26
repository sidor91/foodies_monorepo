import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";

import css from "./Header.module.css";
import SignInUpButton from "../SignInUpButton/SignInUpButton";
import UserNav from "../UserNav/UserNav";

const Header = ({
  isMobileMenuOpen,
  onMobileToggle,
  isLogin,
  isRegister,
  onLogin,
  onRegister,
  isAuthenticated,
  user,
  isAuthLoading,
  onLogout,
}) => {
  const { pathname } = useLocation();
  const isLight = pathname.startsWith("/recipes/");

  const brandClassName = clsx(
    "text-[2rem] leading-[120%] tracking-[-0.02em] font-extrabold tablet:text-[2.4rem] tablet:leading-[160%]",
    isLight ? "text-accent" : "text-bg",
  );

  const buildThemedLinkClass = ({ isActive }) =>
    clsx(
      css.nav__link,
      isLight && css.nav__link_light,
      isActive && css.active,
      isActive && isLight && css.active_light,
    );

  return (
    <header className={css.header__section}>
      <div className={clsx(css.header__container, isLight && css.header__container_light)}>
        <NavLink to="/" className={brandClassName}>
          foodies
        </NavLink>

        <nav className="flex items-center gap-[1.6rem]">
          <NavLink to="/" className={buildThemedLinkClass}>
            Home
          </NavLink>
          <NavLink to="/recipe/add" className={buildThemedLinkClass}>
            Add Recipe
          </NavLink>
        </nav>

        {!isAuthLoading && !isAuthenticated && (
          <SignInUpButton
            isLogin={isLogin}
            isRegister={isRegister}
            onLogin={onLogin}
            onRegister={onRegister}
          />
        )}

        {(isAuthLoading || isAuthenticated) && (
          <div className="flex items-center justify-between gap-[0.4rem]">
            <UserNav user={user} onAuthToggle={onLogout} />
            <button
              className={css.modal__button}
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="open menu"
              onClick={onMobileToggle}
            >
              <svg
                className={clsx("w-[2.8rem] h-[2.8rem]", isLight ? "stroke-accent" : "stroke-bg")}
              >
                <use href="/icons.svg#icon-mobile-menu" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
