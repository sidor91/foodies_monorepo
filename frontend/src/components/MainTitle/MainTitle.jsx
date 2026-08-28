const MainTitle = ({ children, className = "" }) => {
  return (
    <h1
      className={[
        "m-0 text-[2.8rem] font-extrabold leading-[3.2rem] tracking-[-0.02em] uppercase text-accent",
        "tablet:text-[4rem] tablet:leading-[4.4rem]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h1>
  );
};

export default MainTitle;
