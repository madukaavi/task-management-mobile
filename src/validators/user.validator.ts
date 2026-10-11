
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});
