import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(64),
  email: z.email(),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});
