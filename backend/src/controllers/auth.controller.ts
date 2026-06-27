import { Request, response, Response } from "express";
import { createUser, loginUser } from "../services/user.service";
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

/**
 * Login controller
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Authenticate user
    const user = await loginUser(email, password);

    // 3. Success
    return res.status(200).json({
      user,
    });
  } catch (error) {
    // 4. Handle known auth errors
    if (error instanceof Error) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({
          message: error.message,
        });
      }
    }

    // 5. Fallback server error
    return res.status(500).json({
      message: "Unexpected error occurred",
    });
  }
}
