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
export async function createService(data) {
  const {
    name,
    description,
    price,
    durationMin,
    categoryId,
    imageUrl,
    masterIds,
  } = data;

  const masterIdsClean = Array.isArray(masterIds)
    ? masterIds
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id))
    : [];

  if (masterIdsClean.length === 0) {
    const error = new Error("Не передано жодного майстра для послуги");
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {
    const service = await tx.service.create({
      data: {
        name,
        description: description ?? null,
        price: Number(price),
        durationMin: durationMin ? Number(durationMin) : 60,
        categoryId: categoryId ? Number(categoryId) : null,
        imageUrl: imageUrl ?? null,
      },
    });

    await tx.masterService.createMany({
      data: masterIdsClean.map((masterId) => ({
        masterId,
        serviceId: service.id,
      })),
      skipDuplicates: true,
    });

    const serviceWithMasters = await tx.service.findUnique({
      where: { id: service.id },
      include: {
        masters: {
          include: {
            master: true,
          },
        },
      },
    });

    return serviceWithMasters;
  });

  return result;
}

// Оновити послугу (ADMIN)
export async function updateService(id, data) {
  const existing = await prisma.service.findUnique({
    where: { id: Number(id) }
  });

  if (!existing) {
    throw new Error("Service not found");
  }

  const {
    name,
    description,
    price,
    durationMin,
    isActive,
    categoryId,
    imageUrl
  } = data;

  return prisma.service.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(durationMin !== undefined && { durationMin: Number(durationMin) }),
      ...(typeof isActive === "boolean" && { isActive }),
      ...(categoryId !== undefined && { categoryId: categoryId ? Number(categoryId) : null }),
      ...(imageUrl !== undefined && { imageUrl }),
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