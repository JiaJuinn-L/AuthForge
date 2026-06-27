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

/**
 * Login user with email and password
 * @throws Error if credentials are invalid
 * @returns safe user information
 */
export async function loginUser(email: string, password: string) {
  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2. User not found
  if (!user) {
    throw 404;
  }

  // 3. Compare password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // 4. Invalid password
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // 5. Return safe user data (never return password)
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
