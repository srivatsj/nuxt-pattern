import { z } from 'zod';

export const createTodoSchema = z.object({
  text: z.string().min(1, { message: "Todo text cannot be empty" }),
  // completed is handled by the server default or toggle endpoint, not directly on creation by user
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z.object({
  text: z.string().min(1, { message: "Todo text cannot be empty" }).optional(),
  completed: z.boolean().optional(),
});

export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;

// Schema for the full Todo object, useful for frontend or when returning data
export const todoSchema = z.object({
  id: z.number(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.date(), // Assuming transformation from number timestamp to Date object
  updatedAt: z.date(), // Assuming transformation from number timestamp to Date object
});

export type TodoSchema = z.infer<typeof todoSchema>;
