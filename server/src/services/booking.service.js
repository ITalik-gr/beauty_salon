import prisma from "../config/prisma.js";

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatTime(date) {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

const DAY_LABELS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

/**
 * {
 *   service: {...},
 *   masters: [
 *     {
 *       id, name, lastName,
 *       days: [
 *         {
 *           date: "2025-12-01",
 *           dayLabel: "Пн",
 *           day: "1",
 *           monthLabel: "12",
 *           slots: [
 *             { time: "10:00", isAvailable: true },
 *             ...
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export async function getServiceBooking(serviceId, fromDate, daysCount) {
  const id = Number(serviceId);
  if (Number.isNaN(id)) {
    const error = new Error("Некоректний ID послуги");
    error.statusCode = 400;
    throw error;
  }

  const service = await prisma.service.findUnique({
    where: { id, isActive: true },
  });

  if (!service) {
    const error = new Error("Послугу не знайдено");
    error.statusCode = 404;
    throw error;
  }

  const from = fromDate ? new Date(fromDate) : new Date();
  if (isNaN(from.getTime())) {
    const error = new Error("Некоректна дата 'from'");
    error.statusCode = 400;
    throw error;
  }

  // до = from + daysCount
  const to = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + (daysCount || 7),
    23,
    59,
    59,
    999
  );

  // Майстри які роблять цю послугу
  const masters = await prisma.master.findMany({
    where: {
      isActive: true,
      services: {
        some: {
          serviceId: id,
        },
      },
    },
  });

  if (masters.length === 0) {
    return {
      service,
      masters: [],
    };
  }

  const masterIds = masters.map((m) => m.id);

  // Робочі дні майстрів на період
  const workDays = await prisma.masterWorkDay.findMany({
    where: {
      masterId: { in: masterIds },
      date: {
        gte: new Date(from.getFullYear(), from.getMonth(), from.getDate()),
        lte: new Date(to.getFullYear(), to.getMonth(), to.getDate()),
      },
      isDayOff: false,
    },
    orderBy: { date: "asc" },
  });

  // Бронювання майстрів у цей період
  const appointments = await prisma.appointment.findMany({
    where: {
      masterId: { in: masterIds },
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { lt: to },
      endTime: {
        gt: new Date(
          from.getFullYear(),
          from.getMonth(),
          from.getDate(),
          0,
          0,
          0,
          0
        ),
      },
    },
  });

  const duration = service.durationMin || 60;

  const mastersResult = masters.map((master) => {
    const masterWorkDays = workDays.filter(
      (d) => d.masterId === master.id
    );

    const masterAppointments = appointments.filter(
      (a) => a.masterId === master.id
    );

    const days = masterWorkDays.map((wd) => {
      const date = new Date(wd.date);
      const weekday = date.getDay();
      const dayLabel = DAY_LABELS[weekday];

      const day = date.getDate().toString();
      const monthLabel = (date.getMonth() + 1).toString().padStart(2, "0");

      const slots = [];

      let slotStart = new Date(wd.startTime);
      const workEnd = new Date(wd.endTime);

      while (addMinutes(slotStart, duration) <= workEnd) {
        const slotEnd = addMinutes(slotStart, duration);

        const overlapping = masterAppointments.some((appt) => {
          const apStart = new Date(appt.startTime);
          const apEnd = new Date(appt.endTime);

          return apStart < slotEnd && apEnd > slotStart;
        });

        slots.push({
          time: formatTime(slotStart),
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          isAvailable: !overlapping,
        });

        slotStart = addMinutes(slotStart, duration);
      }

      return {
        date: date.toISOString().split("T")[0], // "2025-12-01"
        dayLabel,
        day,
        monthLabel,
        slots,
      };
    });

    return {
      id: master.id,
      name: master.name,
      lastName: master.lastName,
      days,
    };
  });

  return {
    service,
    masters: mastersResult,
  };
}