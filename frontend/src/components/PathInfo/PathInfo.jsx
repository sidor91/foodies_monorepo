import { Link } from "react-router-dom";

const PathInfo = ({ currentPage, homeLabel = "Home", homePath = "/", className = "" }) => {
  return (
    <nav
      className={[
        "text-[1.2rem] font-bold leading-[1.8rem] tracking-[-0.02em] uppercase",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Breadcrumb"
    >
      <ol className="m-0 flex list-none items-start gap-[0.8rem] p-0">
        <li>
          <Link
            className="text-secondary no-underline transition-colors hover:text-accent focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            to={homePath}
          >
            {homeLabel}
          </Link>
        </li>

        <li className="text-secondary" aria-hidden="true">
          /
        </li>

        <li className="text-accent" aria-current="page">
          {currentPage}
        </li>
      </ol>
    </nav>
  );
};

export default PathInfo;
