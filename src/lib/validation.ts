import { z } from "zod";

/**
 * Zod Validation Schemas for System Model Thinking.
 * Enforces strict typing, field length rules, email formats, and password strength requirements.
 */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address (e.g. name@domain.com)" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Full name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(60, { message: "Name cannot exceed 60 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Must include at least one uppercase letter (A-Z)" })
      .regex(/[a-z]/, { message: "Must include at least one lowercase letter (a-z)" })
      .regex(/[0-9]/, { message: "Must include at least one number (0-9)" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  preferredLanguage: z.enum(["en", "fr"]),
  goal: z.string().min(1),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

/**
 * Utility to extract field-level errors from Zod safeParse result
 */
export function extractZodErrors<T>(error: z.ZodError<T>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const fieldName = issue.path[0] as string;
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = issue.message;
    }
  }
  return errors;
}
