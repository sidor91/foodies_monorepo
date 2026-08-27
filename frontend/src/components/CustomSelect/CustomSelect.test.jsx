import { Formik } from "formik";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import CustomSelect from "./CustomSelect.jsx";

const options = [
  { id: "breakfast", name: "Breakfast" },
  { id: "dessert", name: "Dessert" },
];

const renderSelect = (formikProps = {}) => {
  return render(
    <Formik initialValues={{ category: "" }} onSubmit={() => {}} {...formikProps}>
      <CustomSelect
        name="category"
        label="Category"
        value=""
        placeholder="Select category"
        options={options}
      />
    </Formik>,
  );
};

describe("CustomSelect", () => {
  it("renders its label, placeholder and options", () => {
    renderSelect();

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Select category" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "Breakfast" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dessert" })).toBeInTheDocument();
  });

  it("allows the user to select an option", async () => {
    const user = userEvent.setup();
    renderSelect();

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "dessert");

    expect(select).toHaveValue("dessert");
  });

  it("renders a Formik validation error", () => {
    renderSelect({
      initialErrors: { category: "Category is required" },
      initialTouched: { category: true },
    });

    expect(screen.getByText("Category is required")).toBeInTheDocument();
  });
});
