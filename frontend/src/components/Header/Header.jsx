import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";

import css from "./Header.module.css";
import SignInUpButton from "../SignInUpButton/SignInUpButton";
import UserNav from "../UserNav/UserNav";
import {
  selectUser,
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../../../redux/auth/authSelectors";

const Header = ({
  isMobileMenuOpen,
  onMobileToggle,
  isLogin,
  isRegister,
  onLogin,
  onRegister,
  onLogout,
}) => {
  const { pathname } = useLocation();
  const isAddRecipePage = pathname === "/recipe/add";
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const isAuthLoading = useSelector(selectIsRefreshing);

  const buildLinkClass = ({ isActive }) =>
    clsx(css.nav__link, isActive && css.active, isAddRecipePage && css.add__recipe);

  return (
    <header className={css.header__section}>
      <div className={clsx(css.header__container, isAddRecipePage && css.add__recipe)}>
        <NavLink
          to="/"
          className={`${isAddRecipePage && "text-primary"} text-bg text-[2rem] leading-[120%] tracking-[-0.02em] font-extrabold tablet:text-[2.4rem] tablet:leading-[160%]`}
        >
          foodies
        </NavLink>

        <nav className="flex items-center gap-[1.6rem]">
          <NavLink to="/" className={buildLinkClass}>
            Home
          </NavLink>
          <NavLink to="/recipe/add" className={buildLinkClass}>
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
            <UserNav user={user} onLogout={onLogout} isAddRecipePage={isAddRecipePage} />
            <button
              className={css.modal__button}
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="open menu"
              onClick={onMobileToggle}
            >
              <svg className="w-[2.8rem] h-[2.8rem] stroke-bg">
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
