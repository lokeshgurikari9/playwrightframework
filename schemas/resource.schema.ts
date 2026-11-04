import { z } from 'zod';

export const resourceItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  year: z.number().int(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'must be a hex colour'),
  pantone_value: z.string().min(1),
});

export const resourceListSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
  data: z.array(resourceItemSchema),
});

export const singleResourceSchema = z.object({
  data: resourceItemSchema,
});

export type ResourceItemSchema = z.infer<typeof resourceItemSchema>;
export type ResourceListSchema = z.infer<typeof resourceListSchema>;
