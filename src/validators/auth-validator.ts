import { z } from "zod";

export const registerValidator = z.object({
  username: z.string().min(3).max(100).optional(),
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const loginValidator = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});
