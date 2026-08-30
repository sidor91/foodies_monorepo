import { useId } from "react";

const Tooltip = ({ content, children, className = "" }) => {
  const tooltipId = useId();

  if (!content) {
    return children;
  }

  return (
    <span className={`group relative inline-flex ${className}`} aria-describedby={tooltipId}>
      {children}

      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-[0.8rem] max-w-[20rem] -translate-x-1/2 overflow-hidden rounded-[0.8rem] bg-primary px-[1rem] py-[0.6rem] text-center text-[1.2rem] leading-[1.6rem] font-medium text-ellipsis whitespace-nowrap text-bg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
