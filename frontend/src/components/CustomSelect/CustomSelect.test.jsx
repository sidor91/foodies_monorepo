import { Formik, useFormikContext } from "formik";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import CustomSelect from "./CustomSelect.jsx";

const options = [
  { id: "breakfast", name: "Breakfast" },
  { id: "dessert", name: "Dessert" },
];

// mirrors how RecipeFormContent wires CustomSelect: value comes from Formik state
const ConnectedCustomSelect = (props) => {
  const { values } = useFormikContext();
  return <CustomSelect {...props} value={values.category} />;
};

const renderSelect = (formikProps = {}) => {
  return render(
    <Formik initialValues={{ category: "" }} onSubmit={() => {}} {...formikProps}>
      <ConnectedCustomSelect
        name="category"
        label="Category"
        placeholder="Select category"
        options={options}
      />
    </Formik>,
  );
};

describe("CustomSelect", () => {
  it("renders its label, placeholder and options", async () => {
    const user = userEvent.setup();
    renderSelect();

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Select category")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: "Breakfast" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dessert" })).toBeInTheDocument();
  });

  it("allows the user to select an option", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Dessert" }));

    expect(screen.getByText("Dessert")).toBeInTheDocument();
  });

  it("renders a Formik validation error", () => {
    renderSelect({
      initialErrors: { category: "Category is required" },
      initialTouched: { category: true },
    });

    expect(screen.getByText("Category is required")).toBeInTheDocument();
  });
});
