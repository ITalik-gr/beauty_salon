import prisma from "../config/prisma.js";

// публічний список активних майстрів (для клієнтів)
export function getPublicMasters() {
  return prisma.master.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });
}

// Один майстер з його послугами
export function getPublicMasterById(id) {
  return prisma.master.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });
}

// АДМІНСЬКИЙ список майстрів (всі)
export function getAllMastersAdmin() {
  return prisma.master.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });
}

// Створити майстра
export function createMaster(data) {
  const { name, lastName, speciality } = data;

  return prisma.master.create({
    data: {
      name,
      lastName,
      speciality,
    },
  });
}

// Оновити майстра
export function updateMaster(id, data) {
  const { name, lastName, speciality, isActive } = data;

  return prisma.master.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(lastName && { lastName }),
      ...(speciality !== undefined && { speciality }),
      ...(typeof isActive === "boolean" && { isActive }),
    },
  });
}

// деактивація
export function deactivateMaster(id) {
  return prisma.master.update({
    where: { id },
    data: { isActive: false },
  });
}

/**
 * Задати, які послуги робить майстер
 * (перезаписуємо список: ті, яких нема в newServiceIds — видаляємо,
 *   нові — додаємо)
 */
export async function setMasterServices(masterId, newServiceIds) {
  const master = await prisma.master.findUnique({
    where: { id: masterId },
  });

  if (!master) {
    const error = new Error("Майстра з таким ID не знайдено");
    error.statusCode = 404;
    throw error;
  }

  // якщо пустий масив то видаляємо всі звязки
  if (!Array.isArray(newServiceIds) || newServiceIds.length === 0) {
    await prisma.masterService.deleteMany({
      where: { masterId },
    });

    return prisma.master.findUnique({
      where: { id: masterId },
      include: {
        services: {
          include: { service: true },
        },
      },
    });
  }


  const services = await prisma.service.findMany({
    where: {
      id: { in: newServiceIds },
    },
    select: { id: true },
  });

  const existingIds = services.map((s) => s.id);

  const missingIds = newServiceIds.filter(
    (id) => !existingIds.includes(id)
  );

  if (missingIds.length > 0) {
    const error = new Error(
      `Деякі послуги не знайдено: ${missingIds.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.masterService.findMany({
    where: { masterId },
  });

  const existingServiceIds = existing.map((ms) => ms.serviceId);

  const toDelete = existingServiceIds.filter(
    (id) => !newServiceIds.includes(id)
  );
  const toCreate = newServiceIds.filter(
    (id) => !existingServiceIds.includes(id)
  );

  return prisma.$transaction(async (tx) => {
    if (toDelete.length > 0) {
      await tx.masterService.deleteMany({
        where: {
          masterId,
          serviceId: { in: toDelete },
        },
      });
    }

    if (toCreate.length > 0) {
      await tx.masterService.createMany({
        data: toCreate.map((serviceId) => ({
          masterId,
          serviceId,
        })),
      });
    }

    return tx.master.findUnique({
      where: { id: masterId },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  });
}