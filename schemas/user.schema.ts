import { z } from 'zod';

export const userItemSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  avatar: z.url(),
});

export const supportSchema = z.object({
  url: z.url(),
  text: z.string(),
});

export const userListSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
  data: z.array(userItemSchema),
  support: supportSchema.optional(),
});

export const singleUserSchema = z.object({
  data: userItemSchema,
  support: supportSchema.optional(),
});

export const createdUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  job: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export const updatedUserSchema = z.object({
  name: z.string().min(1),
  job: z.string().min(1),
  updatedAt: z.iso.datetime(),
});

export type UserItemSchema = z.infer<typeof userItemSchema>;
export type UserListSchema = z.infer<typeof userListSchema>;
export type CreatedUserSchema = z.infer<typeof createdUserSchema>;
export type UpdatedUserSchema = z.infer<typeof updatedUserSchema>;
