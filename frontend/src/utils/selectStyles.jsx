import { components } from "react-select";
import Icon from "../components/Icon/Icon.jsx";
const isTablet = typeof window !== "undefined" && window.matchMedia("(min-width: 48rem)").matches;

export const customStyles = {
  // text, which is displayed when no option is selected
  placeholder: (provided) => ({
    ...provided,
    fontSize: isTablet ? "1.6rem" : "1.4rem",
    lineHeight: isTablet ? "150%" : "143%",
    color: "var(--grey)",
  }),

  // text of the selected option
  singleValue: (provided) => ({
    ...provided,
    fontSize: isTablet ? "1.6rem" : "1.4rem",
    lineHeight: isTablet ? "150%" : "143%",
    color: "var(--black)",
  }),

  // main button (field) that is clicked
  control: (provided, state) => ({
    ...provided,
    borderRadius: "3rem",
    borderColor: state.isFocused ? "#bfbebe" : "#bfbebe",
    backgroundColor: "transparent",
    padding: "1.6rem 1.4rem",
    boxShadow: "none",
    cursor: "pointer",

    "&:hover": {
      borderColor: "#bfbebe",
      transform: "scale(1.01)",
      transition: "250ms ease-in-out",
    },
  }),

  // the dropdown menu itself
  menu: (provided) => ({
    ...provided,
    borderRadius: "1.5rem",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    marginTop: "0.8rem",
    zIndex: 20,
  }),

  // list of options inside the dropdown menu
  menuList: (provided) => ({
    ...provided,
    padding: "1.6rem 1.8rem",
    maxHeight: "24rem",
  }),

  // individual options in the list
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f3f3" : "transparent",
    color: "#1a1a1a",
    borderRadius: "0.8rem",
    cursor: "pointer",
    padding: "1.6rem 1.8rem",
    fontSize: isTablet ? "1.6rem" : "1.4rem",
    lineHeight: isTablet ? "150%" : "143%",
  }),

  // remove the default blue focus line around the entire container
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

export const CustomDropdownIndicator = (props) => {
  const { menuIsOpen } = props.selectProps;

  return (
    <components.DropdownIndicator {...props}>
      <Icon
        name="arrow-down"
        className={`absolute right-[1.6rem] top-1/2 -translate-y-1/2 pointer-events-none w-[2rem] h-[2rem]
        stroke-[#050505] fill-none ${menuIsOpen ? "rotate-180" : "rotate-0"} `}
      />
    </components.DropdownIndicator>
  );
};
