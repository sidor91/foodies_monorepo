import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ImageUploader from "./ImageUploader.jsx";

describe("ImageUploader", () => {
  it("shows the initial upload prompt", () => {
    render(<ImageUploader previewUrl="" handleImageUpload={() => {}} setFieldValue={() => {}} />);

    expect(screen.getByText("Upload a photo")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Recipe preview" })).not.toBeInTheDocument();
  });

  it("shows the image preview and another upload prompt", () => {
    render(
      <ImageUploader
        previewUrl="preview.jpg"
        handleImageUpload={() => {}}
        setFieldValue={() => {}}
      />,
    );

    expect(screen.getByRole("img", { name: "Recipe preview" })).toHaveAttribute(
      "src",
      "preview.jpg",
    );
    expect(screen.getByText("Upload another photo")).toBeInTheDocument();
  });

  it("passes the change event and setFieldValue to the upload handler", async () => {
    const user = userEvent.setup();
    const handleImageUpload = vi.fn();
    const setFieldValue = vi.fn();
    const file = new File(["recipe image"], "recipe.png", { type: "image/png" });

    render(
      <ImageUploader
        previewUrl=""
        handleImageUpload={handleImageUpload}
        setFieldValue={setFieldValue}
      />,
    );

    const input = screen.getByLabelText("Upload a photo");
    await user.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(handleImageUpload).toHaveBeenCalledOnce();
    expect(handleImageUpload).toHaveBeenCalledWith(expect.any(Object), setFieldValue);
  });
});
