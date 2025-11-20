import prisma from "../config/prisma.js";

export function getPublicServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
    },
  });
}

// Отримати одну послугу (активну) по id
export function getPublicServiceById(id) {
  return prisma.service.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      category: true,
    },
  });
}

// Адмінський список усіх послуг (включно з неактивними)
export function getAllServicesAdmin() {
  return prisma.service.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      category: true,
    },
  });
}

// Створити послугу (ADMIN)
export function createService(data) {
  const { name, description, price, durationMin, categoryId } = data;

  return prisma.service.create({
    data: {
      name,
      description,
      price,
      durationMin: durationMin ?? 60,
      categoryId: categoryId ?? null,
    },
  });
}

// Оновити послугу (ADMIN)
export async function updateService(id, data) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Service not found");
  }

  const { name, description, price, durationMin, isActive, categoryId } = data;

  return prisma.service.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(durationMin !== undefined && { durationMin }),
      ...(typeof isActive === "boolean" && { isActive }),
      ...(categoryId !== undefined && { categoryId }),
    },
  });
}

// "Видалити" послугу
export function deactivateService(id) {
  return prisma.service.update({
    where: { id },
    data: { isActive: false },
  });
}