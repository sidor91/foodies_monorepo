import { NavLink } from "react-router-dom";
import SocialLinks from "../SocialLinks/SocialLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex flex-col gap-16 w-full max-w-150 mb-[4.8rem] tablet:max-w-[76.8rem] desktop:max-w-[144rem] ">
      <div className="flex pl-[1.6rem] pr-[1.6rem] justify-between items-center">
        <NavLink
          to="/"
          className="text-accent text-[2rem] leading-[120%] tracking-[-0.02em] font-extrabold tablet:text-[2.4rem] tablet:leading-[160%]"
        >
          foodies
        </NavLink>

        <SocialLinks />
      </div>
      <div className="w-full h-px bg-secondary"></div>

      <p className="text-[1.4rem] leading-[145%] font-medium tracking-[-0.02em] text-primary self-center tablet:text-[1.6rem]">&copy;{currentYear}, Foodies. All rights reserved</p>
    </footer>
  );
};

export default Footer;
