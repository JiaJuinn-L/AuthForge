import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { registerSchema } from "../utils/auth.validator";

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return res.status(400).json({
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    });
  }

  try {
    const { email, password } = result.data;
    const user = await createUser(email, password);

    return res.status(201).json({ user });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    return res.status(409).json({
      errors: {
        email: message,
      },
    });
  }
}
