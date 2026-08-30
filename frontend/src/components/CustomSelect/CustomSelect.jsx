import { useFormikContext } from "formik";

import { FormError } from "../RecipeFormContent/RecipeFormContent.jsx";
import Select from "react-select";
import { customStyles } from "../../utils/selectStyles.jsx";
import { CustomDropdownIndicator } from "../../utils/selectStyles.jsx";

export const CustomSelect = ({ name, label, value, placeholder, options, className }) => {
  const { setFieldValue } = useFormikContext();

  const selectedOption = options.find((option) => option.id === value || option.value === value);

  return (
    <div className={`flex flex-col gap-[0.8rem] tablet:gap-[1.6rem] w-full ${className || ""}`}>
      {label && (
        <label className="font-[800] uppercase leading-[150%] tablet:text-[2rem] tablet:leading-[120%] text-text">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <Select
          name={name}
          options={options}
          value={selectedOption || null}
          components={{
            IndicatorSeparator: null,
            DropdownIndicator: CustomDropdownIndicator,
          }}
          onChange={(option) => {
            // given that the option can be null (when the user clears the selection), we need to handle that case
            setFieldValue(name, option ? option.id || option.value : "");
          }}
          placeholder={placeholder}
          styles={customStyles}
          isSearchable={false}
          // if the option has a name property, use it as the label, otherwise use the label property
          getOptionLabel={(option) => option.name || option.label}
          getOptionValue={(option) => option.id || option.value}
        />
      </div>

      {name && <FormError name={name} />}
    </div>
  );
};

export default CustomSelect;
