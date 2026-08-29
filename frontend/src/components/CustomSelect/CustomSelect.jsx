import { useFormikContext } from "formik";

import Dropdown from "../Dropdown/Dropdown.jsx";
import { FormError } from "../RecipeFormContent/RecipeFormContent.jsx";

const CustomSelect = ({ name, label, value, placeholder, options, className }) => {
  const { setFieldValue, setFieldTouched, touched, errors } = useFormikContext();
  const hasError = Boolean(touched[name] && errors[name]);

  return (
    <div className="flex flex-col gap-[0.8rem] tablet:gap-[1.6rem] w-full">
      <Dropdown
        id={name}
        label={label}
        value={value}
        onChange={(nextValue) => setFieldValue(name, nextValue)}
        onBlur={() => setFieldTouched(name, true)}
        options={options}
        placeholder={placeholder}
        className={className}
        error={hasError}
      />

      {name && <FormError name={name} />}
    </div>
  );
};

export default CustomSelect;
