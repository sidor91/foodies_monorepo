import { useEffect } from "react";

import css from "./LogoutModal.module.css";

const LogoutModal = ({ isLogout, onLogoutToggle, onLogout }) => {
  useEffect(() => {
    if (!isLogout) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onLogoutToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLogout, onLogoutToggle]);

  return (
    <div className={`${css.modal__overlay} ${isLogout ? css.is__open : ""}`}>
      <div className={css.modal}>
        <button
          type="button"
          className="absolute top-[1.6rem] right-[1.6rem] text-accent text-[1.2rem] leading-[150%] tracking-[-0.02em] tablet:top-8 tablet:right-8"
          onClick={onLogoutToggle}
          aria-label="Close Modal"
        >
          <svg className="w-[2.4rem] h-[2.4rem] fill-none stroke-accent">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-[1.6rem] tablet:gap-8">
          <h2 className={css.title__mobile}>Log out</h2>
          <h2 className={css.title__tablet}>Are you logging out?</h2>

          <p className={css.sub__title}>You can always log back in at my time.</p>
        </div>

        <div className="w-full flex flex-col gap-[1.6rem] tablet:gap-8">
          <button
            className="btn btn__primary pt-[1.4rem] pb-[1.4rem] font-[1.4rem] uppercase tablet:pt-[1.6rem] tablet:pb-[1.6rem]"
            type="button"
            onClick={onLogout}
          >
            Log Out
          </button>

          <button
            className="btn btn__secondary pt-[1.4rem] pb-[1.4rem]"
            type="button"
            onClick={onLogoutToggle}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
