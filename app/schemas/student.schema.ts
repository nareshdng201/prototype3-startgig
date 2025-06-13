import { z } from 'zod';

export const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  education: z.string().min(1, 'Education field is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  experience: z.string().optional(),
  location: z.string().min(1, 'Location field is required'),
  role: z.literal('student'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isApproved: z.literal('pending'),
});

export type StudentSchema = z.infer<typeof studentSchema>; 