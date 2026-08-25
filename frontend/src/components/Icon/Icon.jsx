import clsx from "clsx";

const Icon = ({ name, className, size = 24, ...props }) => {
  return (
    <svg className={clsx("inline-block shrink-0", className)} width={size} height={size} {...props}>
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
};

export default Icon;
