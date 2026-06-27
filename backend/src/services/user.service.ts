import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

/**
 * Find a user by email
 * @returns user or null
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Create a new user
 * @throws Error if user already exists
 * @returns user informations
 */
export async function createUser(email: string, password: string) {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
