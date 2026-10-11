
import { z } from "zod";

// CREATE TASK VALIDATION
export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title cannot exceed 200 characters"),
});

// UPDATE TASK VALIDATION
export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Task title cannot be empty")
      .max(200, "Task title cannot exceed 200 characters")
      .optional(),

    completed: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.completed !== undefined,
    {
      message: "At least one field is required",
    }
  );

// SEARCH + PAGINATION VALIDATION
export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().max(100).optional(),
});
