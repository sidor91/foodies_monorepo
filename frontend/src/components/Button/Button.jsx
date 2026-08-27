import clsx from "clsx";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  isActive = false,
  disabled = false,
  className,
  to,
  type = "button",
  onClick,
  ...props
}) => {
  const buttonClass = clsx(
    "btn",
    variant === "secondary" ? "btn__secondary" : "btn__primary",
    isActive && "btn__active",
    className,
  );

  if (to) {
    const handleLinkClick = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);
    };

    return (
      <Link
        to={to}
        className={buttonClass}
        aria-disabled={disabled}
        onClick={handleLinkClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClass} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
