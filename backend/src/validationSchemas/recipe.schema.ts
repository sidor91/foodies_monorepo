import { z } from "zod";

export const createRecipeSchema = z.object({
  title: z.string().trim().min(1).max(128),
  instructions: z.string().trim().min(1),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  time: z.string().regex(/^\d+$/).optional(),
  categoryId: z.string().min(1),
  areaId: z.string().min(1),
  ingredients: z.string().optional(),
});
