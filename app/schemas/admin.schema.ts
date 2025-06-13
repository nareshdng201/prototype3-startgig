import { z } from 'zod';

export const adminSchema = z.object({
  role: z.literal('admin'),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  image: z.string().optional(),
}); 