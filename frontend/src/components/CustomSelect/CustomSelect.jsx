import { Field } from "formik";
import { FormError } from "../RecipeFormContent/RecipeFormContent.jsx";

const CustomSelect = ({ name, label, value, placeholder, options, className }) => {
  const selectClasses = `focus:outline-none bg-transparent text-[1.4rem] tablet:text-[1.6rem] leading-[143%] tablet:leading-[150%]
  border border-(--grey) w-full rounded-[3rem] p-[1.4rem] pr-[4rem] appearance-none ${
    value ? "text-(--black)" : "text-(--grey)"
  } ${className || ""}`;
  return (
    <div className="flex flex-col gap-[0.8rem] tablet:gap-[1.6rem] w-full">
      {label && (
        <label className="font-[800] uppercase leading-[150%] tablet:text-[2rem] tablet:leading-[120%]">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <Field as="select" name={name} className={selectClasses}>
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {options.map((item) => (
            <option key={item.id} value={item.id} className="text-(--black)">
              {item.name}
            </option>
          ))}
        </Field>

        {/* Arrow */}
        <svg className="absolute right-[1.6rem] top-1/2 -translate-y-1/2 pointer-events-none w-[2rem] h-[2rem] stroke-current fill-none">
          <use href="/icons.svg#icon-arrow-down" />
        </svg>
      </div>

      {/* Validation error message (if name is provided) */}
      {name && <FormError name={name} />}
    </div>
  );
};

export default CustomSelect;
