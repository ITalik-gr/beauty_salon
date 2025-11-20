import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not set in .env");
}

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function registerUser({ email, password, name, lastName }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const error = new Error("Користувач з таким email вже існує");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      lastName,
    },
  });

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Невірний email або пароль");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Невірний email або пароль");
    error.statusCode = 400;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    },
    token,
  };
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}