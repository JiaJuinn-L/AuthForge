import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { registerSchema } from "../utils/auth.validator";

export default async function register(req: Request, res: Response) {
  try {
    const result = registerSchema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      return res.status(400).json({
        message: "Validation error",
        errors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      });
    }

    const { email, password } = result.data;
    const user = await createUser(email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    return res.status(400).json({
      success: false,
      message,
    });
  }
}
