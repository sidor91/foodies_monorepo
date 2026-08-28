import { z } from "zod";

const ingredientsSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === "") {
      return [];
    }

    if (typeof value !== "string") {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  z.array(
    z.object({
      ingredientId: z.string().min(1),
      measure: z.string().optional(),
    }),
  ),
);

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1).max(128),
  instructions: z.string().trim().min(1).max(1000),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  time: z.string().regex(/^\d+$/).optional(),
  categoryId: z.string().min(1),
  areaId: z.string().min(1),
  ingredients: ingredientsSchema,
});
