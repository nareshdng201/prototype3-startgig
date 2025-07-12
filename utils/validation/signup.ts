import { z } from "zod"

// Base user schema
const baseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  role: z.enum(["student", "employer", "admin"]),
  location: z.string()?.optional()
})

// Student-specific schema
const studentSchema = baseUserSchema.extend({
  role: z.literal("student"),
  education: z.string().min(1, "Education is required").min(5, "Education must be at least 5 characters"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.string().optional(),
})

// Employer-specific schema
const employerSchema = baseUserSchema.extend({
  role: z.literal("employer"),
  companyName: z.string().min(1, "Company name is required").min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(10, "Company description must be at least 10 characters"),
})

// Admin-specific schema
const adminSchema = baseUserSchema.extend({
  role: z.literal("admin"),
  schoolName: z.string().min(1, "School name is required").min(2, "School name must be at least 2 characters"),
})

// Union schema for all user types
export const signupSchema = z.discriminatedUnion("role", [
  studentSchema,
  employerSchema,
  adminSchema,
]).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// More flexible type for form data that includes all possible fields
export type SignupFormData = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: "student" | "employer" | "admin"
  companyName?: string
  schoolName?: string
  education?: string
  skills?: string[]
  experience?: string
  location: string
  website?: string
  description?: string
  phoneNumber?: string
}

// Individual field schemas for real-time validation
export const emailSchema = z.string().email("Please enter a valid email address")
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
export const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
export const urlSchema = z.string().url("Please enter a valid URL").optional().or(z.literal("")) 