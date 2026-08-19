import { NavLink } from "react-router-dom";
import clsx from "clsx";

import css from "./Header.module.css";

const buildLinkClass = ({ isActive }) => {
  return clsx(css.nav__link, isActive && css.active);
};

const Header = ({ isMobileMenuOpen, onToggle }) => {
  return <header></header>;
};

export default Header;
