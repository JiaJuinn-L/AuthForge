import { z } from "zod";

/**
 * Validation for user registration
 */
export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
