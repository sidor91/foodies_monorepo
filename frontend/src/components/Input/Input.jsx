import clsx from "clsx";

const Input = ({
  variant = "primary",
  isActive = false,
  className,
  disabled = false,
  ...props
}) => {
  const inputClass = clsx(
    "input",
    variant === "secondary" ? "input__secondary" : "input__primary",
    isActive && "input__active",
    className,
  );

  return <input className={inputClass} disabled={disabled} {...props} />;
};

export default Input;
