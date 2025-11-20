import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export function getAllUsers() {
  return prisma.user.findMany();
}

export function createUser(data) {
  return prisma.user.create({ data });
}

export function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function updateUserProfile(userId, data) {
  const { email, name, lastName } = data;

  if (!email && !name && !lastName) {
    const error = new Error("Немає даних для оновлення");
    error.statusCode = 400;
    throw error;
  }

  if (email) {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing && existing.id !== userId) {
      const error = new Error("Користувач з таким email вже існує");
      error.statusCode = 400;
      throw error;
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(email && { email }),
      ...(name && { name }),
      ...(lastName && { lastName }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  return updated;
}

export async function updateUserPassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("Користувача не знайдено");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isMatch) {
    const error = new Error("Невірний поточний пароль");
    error.statusCode = 400;
    throw error;
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: newHash,
    },
  });

  return { success: true };
}