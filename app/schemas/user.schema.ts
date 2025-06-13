import { z } from 'zod';
import { studentSchema } from './student.schema';
import { employerSchema } from './employer.schema';
import { adminSchema } from './admin.schema';

export const userSchema = z.discriminatedUnion('role', [
  studentSchema,
  employerSchema,
  adminSchema
]);

export type UserSchema = z.infer<typeof userSchema>;

// Helper function to validate user data based on role
export const validateUserData = (data: unknown) => {
  return userSchema.safeParse(data);
}; 