import { Listbox } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";

import css from "./Dropdown.module.css";

// generic controlled dropdown backed by Headless UI's Listbox: accessible,
// keyboard/touch friendly, and the options panel scrolls for long backend lists
const Dropdown = ({
  id,
  label,
  ariaLabel,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Select...",
  className,
  error = false,
  disabled = false,
}) => {
  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className={clsx(css.wrapper, className)}>
      <Listbox value={value ?? ""} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            {label && <Listbox.Label className={css.label}>{label}</Listbox.Label>}

            <div className={css.listbox}>
              <Listbox.Button
                id={id}
                onBlur={onBlur}
                aria-label={!label ? ariaLabel : undefined}
                className={clsx(css.button, error && css.buttonError, open && css.buttonOpen)}
              >
                <span className={clsx(css.value, !selectedOption && css.placeholder)}>
                  {selectedOption ? selectedOption.name : placeholder}
                </span>
                <svg
                  className={clsx(css.arrow, open && css.arrowOpen)}
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/icons.svg#icon-chevron-down" />
                </svg>
              </Listbox.Button>

              <Listbox.Options className={css.options}>
                {options.length === 0 ? (
                  <div className={css.empty}>No options</div>
                ) : (
                  options.map((option) => (
                    <Listbox.Option key={option.id} value={option.id} as={Fragment}>
                      {({ active, selected }) => (
                        <li
                          className={clsx(
                            css.option,
                            active && css.optionActive,
                            selected && css.optionSelected,
                          )}
                        >
                          <span className={css.optionLabel}>{option.name}</span>
                          {selected && (
                            <svg className={css.checkIcon} aria-hidden="true" focusable="false">
                              <use href="/icons.svg#icon-check" />
                            </svg>
                          )}
                        </li>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default Dropdown;
