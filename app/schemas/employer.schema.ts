import { z } from 'zod';

export const employerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(1, 'Location field is required'),
  website: z.string().url('Invalid website URL').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  role: z.literal('employer'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type EmployerSchema = z.infer<typeof employerSchema>; 