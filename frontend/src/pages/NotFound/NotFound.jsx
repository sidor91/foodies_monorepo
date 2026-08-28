import { NavLink } from "react-router-dom";
import { SectionContainer } from "../../components/index.js";

const NotFound = () => {
  return (
    <SectionContainer>
      <h1 className="mt-24 mb-24 text-text text-[2.4rem] font-medium leading-[125%] tracking-[-0.02em]">
        Oops, something went wrong...
      </h1>

      <div className="flex items-end gap-[0.8rem] tablet:justify-center">
        <p className="text-[1.4rem] font-medium leading-[145%] tracking-[-0.02em]">{`Page wasn't found. Go back to `}</p>
        <NavLink
          to="/"
          className="text-accent text-[1.6rem] font-bold leading-[145%] tracking-[-0.02em] underline"
        >
          Home
        </NavLink>
      </div>
    </SectionContainer>
  );
};

export default NotFound;
