import clsx from "clsx";

import css from "./SignInUpButton.module.css";

const SignInUpButton = ({ isLogin, isRegister, onLogin, onRegister }) => {
  return (
    <nav className="bg-bg flex items-center rounded-[3rem]">
      <button
        type="button"
        className={clsx(css.sign__btn, isLogin && css.active)}
        onClick={onLogin}
      >
        Sign In
      </button>
      <button
      
        type="button"
        className={clsx(css.sign__btn, isRegister && css.active, !isLogin && css.default)}
        onClick={onRegister}
      >
        Sign Up
      </button>
    </nav>
  );
};

export default SignInUpButton;
