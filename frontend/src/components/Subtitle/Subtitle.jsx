const DEFAULT_TEXT =
  "Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.";

const Subtitle = ({ children = DEFAULT_TEXT, muted = false, className = "" }) => {
  return (
    <p
      className={[
        "m-0 max-w-[34.3rem] text-[1.4rem] font-medium leading-[2rem] tracking-[-0.02em]",
        "tablet:max-w-[44.3rem] tablet:text-[1.6rem] tablet:leading-[2.4rem]",
        muted ? "text-secondary" : "text-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
};

export default Subtitle;
