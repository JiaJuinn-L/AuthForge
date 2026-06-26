import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

/**
 * Create a new user in database
 */
export async function createUser(email: string, password: string) {
  // 1. check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // 4. return safe user (no password)
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
