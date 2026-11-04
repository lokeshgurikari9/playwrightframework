import { z } from 'zod';

export const loginSuccessSchema = z.object({
  token: z.string().min(1),
});

export const registerSuccessSchema = z.object({
  id: z.number().int().positive(),
  token: z.string().min(1),
});

export const authErrorSchema = z.object({
  error: z.string().min(1),
});

export type LoginSuccess = z.infer<typeof loginSuccessSchema>;
export type RegisterSuccess = z.infer<typeof registerSuccessSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;
