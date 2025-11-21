import prisma from "../config/prisma.js";

// Отримати розклад майстра по діапазону дат (для адмінки або фронта)
export function getMasterWorkDays(masterId, fromDate, toDate) {
  return prisma.masterWorkDay.findMany({
    where: {
      masterId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: { date: "asc" },
  });
}

// Створити робочий день
export function createMasterWorkDay(data) {
  const { masterId, date, startTime, endTime, isDayOff } = data;

  return prisma.masterWorkDay.create({
    data: {
      masterId,
      date,
      startTime,
      endTime,
      isDayOff: !!isDayOff,
    },
  });
}

// Оновити робочий день
export function updateMasterWorkDay(id, data) {
  const { date, startTime, endTime, isDayOff } = data;

  return prisma.masterWorkDay.update({
    where: { id },
    data: {
      ...(date && { date }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(typeof isDayOff === "boolean" && { isDayOff }),
    },
  });
}

// Видалити робочий день
export function deleteMasterWorkDay(id) {
  return prisma.masterWorkDay.delete({
    where: { id },
  });
}

function combineDateAndTime(date, timeStr) {
  // timeStr типу 09:00
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = Number(hoursStr) || 0;
  const minutes = Number(minutesStr) || 0;

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  );
}

// Генерація розкладу по шаблону тижня на діапазон дат
export async function generateMasterWorkDaysForPeriod({
  masterId,
  from,
  to,
  pattern,
}) {
  // Перевіримо що майстер існує
  const master = await prisma.master.findUnique({
    where: { id: masterId },
  });

  if (!master) {
    const error = new Error("Майстра з таким ID не знайдено");
    error.statusCode = 404;
    throw error;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    const error = new Error("Некоректні дати from/to");
    error.statusCode = 400;
    throw error;
  }

  if (fromDate > toDate) {
    const error = new Error("Дата 'from' не може бути більшою за 'to'");
    error.statusCode = 400;
    throw error;
  }

  if (!pattern || typeof pattern !== "object") {
    const error = new Error("pattern має бути об'єктом з днями тижня");
    error.statusCode = 400;
    throw error;
  }

  // Клонуємо дату щоб не мутувати fromDate
  let current = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );

  const end = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate()
  );

  // Пройдемось по всіх днях
  while (current <= end) {
    const weekday = current.getDay(); // 0-6
    const config =
      pattern[String(weekday)] !== undefined
        ? pattern[String(weekday)]
        : pattern[weekday];

    if (config) {
      // шукать чи вже є запис для цього майстра і цієї дати
      const existing = await prisma.masterWorkDay.findFirst({
        where: {
          masterId,
          date: new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDate()
          ),
        },
      });

      if (config.isDayOff) {
        // Вихідний день
        if (existing) {
          await prisma.masterWorkDay.update({
            where: { id: existing.id },
            data: {
              isDayOff: true,
              // занулити часи
              // startTime: existing.startTime,
              // endTime: existing.endTime,
            },
          });
        } else {
          await prisma.masterWorkDay.create({
            data: {
              masterId,
              date: new Date(
                current.getFullYear(),
                current.getMonth(),
                current.getDate()
              ),
              // ставимо часи хоча б як 00:00
              startTime: combineDateAndTime(current, "00:00"),
              endTime: combineDateAndTime(current, "00:00"),
              isDayOff: true,
            },
          });
        }
      } else if (config.startTime && config.endTime) {
        const startTime = combineDateAndTime(current, config.startTime);
        const endTime = combineDateAndTime(current, config.endTime);

        if (existing) {
          await prisma.masterWorkDay.update({
            where: { id: existing.id },
            data: {
              date: new Date(
                current.getFullYear(),
                current.getMonth(),
                current.getDate()
              ),
              startTime,
              endTime,
              isDayOff: false,
            },
          });
        } else {
          await prisma.masterWorkDay.create({
            data: {
              masterId,
              date: new Date(
                current.getFullYear(),
                current.getMonth(),
                current.getDate()
              ),
              startTime,
              endTime,
              isDayOff: false,
            },
          });
        }
      } else {
        // config є але немає ні isDayOff, ні часу тоді просто пропускаємо
      }
    }

    // +1 день
    current.setDate(current.getDate() + 1);
  }

  // Повернемо весь розклад на період
  const result = await prisma.masterWorkDay.findMany({
    where: {
      masterId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: { date: "asc" },
  });

  return result;
}