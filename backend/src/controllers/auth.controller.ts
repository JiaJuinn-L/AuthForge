import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { registerSchema } from "../utils/auth.validator";
import { z } from "zod";

export default async function register(req: Request, res: Response) {
  try {
    // 1. validate input
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: z.flattenError(result.error),
      });
    }

    const { email, password } = result.data;

    // 2. create user
    const user = await createUser(email, password);

    // 3. response
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
