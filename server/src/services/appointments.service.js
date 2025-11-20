import prisma from "../config/prisma.js";

// Перевірка що майстер робить цю послугу
async function ensureMasterDoesService(masterId, serviceId) {
  const ms = await prisma.masterService.findFirst({
    where: { masterId, serviceId },
  });

  if (!ms) {
    const error = new Error("Цей майстер не надає обрану послугу");
    error.statusCode = 400;
    throw error;
  }
}

// Створити бронювання (клієнт)
export async function createAppointment(userId, data) {
  const { masterId, serviceId, startTime, note } = data;

  const masterIdNum = Number(masterId);
  const serviceIdNum = Number(serviceId);
  const start = new Date(startTime);

  if (!masterIdNum || !serviceIdNum || !startTime) {
    const error = new Error(
      "masterId, serviceId і startTime є обов'язковими"
    );
    error.statusCode = 400;
    throw error;
  }

  // Перевірка майстра, сервісу
  const [master, service] = await Promise.all([
    prisma.master.findUnique({ where: { id: masterIdNum } }),
    prisma.service.findUnique({ where: { id: serviceIdNum } }),
  ]);

  if (!master || !master.isActive) {
    const error = new Error("Майстра не знайдено або він не активний");
    error.statusCode = 400;
    throw error;
  }

  if (!service || !service.isActive) {
    const error = new Error("Послугу не знайдено або вона не активна");
    error.statusCode = 400;
    throw error;
  }

  // майстер реально надає цю послугу?
  await ensureMasterDoesService(masterIdNum, serviceIdNum);

  // Розрахунок endTime
  const end = new Date(start.getTime() + service.durationMin * 60 * 1000);

  // Чек що майстер працює в цей день та час
  const startDateOnly = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const workDay = await prisma.masterWorkDay.findFirst({
    where: {
      masterId: masterIdNum,
      date: startDateOnly,
      isDayOff: false,
    },
  });

  if (!workDay) {
    const error = new Error("У майстра немає робочого дня на цю дату");
    error.statusCode = 400;
    throw error;
  }

  if (
    start < workDay.startTime ||
    end > workDay.endTime
  ) {
    const error = new Error(
      "Час не входить у робочий інтервал майстра на цю дату"
    );
    error.statusCode = 400;
    throw error;
  }

  // Перевірка на конфлікт з іншими записами
  const overlapping = await prisma.appointment.findFirst({
    where: {
      masterId: masterIdNum,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        {
          startTime: { lt: end },
          endTime: { gt: start },
        },
      ],
    },
  });

  if (overlapping) {
    const error = new Error("Цей час вже зайнятий");
    error.statusCode = 400;
    throw error;
  }

  // створення броні
  const appointment = await prisma.appointment.create({
    data: {
      userId,
      masterId: masterIdNum,
      serviceId: serviceIdNum,
      startTime: start,
      endTime: end,
      note: note || null,
    },
    include: {
      service: true,
      master: true,
    },
  });

  return appointment;
}

// список броней користувача
export function getUserAppointments(userId) {
  return prisma.appointment.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    include: {
      service: true,
      master: true,
    },
  });
}

// всі броні (для адміна)
export function getAllAppointments() {
  return prisma.appointment.findMany({
    orderBy: { startTime: "desc" },
    include: {
      user: true,
      service: true,
      master: true,
    },
  });
}

// Змінити статус броні (адмін)
export async function updateAppointmentStatus(id, status) {
  const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

  if (!validStatuses.includes(status)) {
    const error = new Error("Некоректний статус бронювання");
    error.statusCode = 400;
    throw error;
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: {
      user: true,
      service: true,
      master: true,
    },
  });

  return appointment;
}