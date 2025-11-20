import * as workdaysService from "../services/workdays.service.js";

// GET /api/workdays/master/:masterId
// ?from=2025-11-20&to=2025-11-30
export async function getMasterWorkDaysController(req, res) {
  try {
    const masterId = Number(req.params.masterId);
    if (Number.isNaN(masterId)) {
      return res.status(400).json({ message: "Некоректний ID майстра" });
    }

    const from = req.query.from
      ? new Date(req.query.from)
      : new Date(); // сьогодні
    const to = req.query.to
      ? new Date(req.query.to)
      : new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 днів

    const days = await workdaysService.getMasterWorkDays(masterId, from, to);
    res.json(days);
  } catch (err) {
    console.error("Error getMasterWorkDays:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/workdays/admin
export async function createMasterWorkDayController(req, res) {
  try {
    const { masterId, date, startTime, endTime, isDayOff } = req.body;

    if (!masterId || !date) {
      return res
        .status(400)
        .json({ message: "masterId і date є обов'язковими" });
    }

    // перетворимо строки в Date
    const dayDate = new Date(date);
    const start = startTime ? new Date(startTime) : null;
    const end = endTime ? new Date(endTime) : null;

    if (!isDayOff && (!start || !end)) {
      return res.status(400).json({
        message: "Для робочого дня потрібні startTime і endTime",
      });
    }

    const workDay = await workdaysService.createMasterWorkDay({
      masterId: Number(masterId),
      date: dayDate,
      startTime: start || dayDate,
      endTime: end || dayDate,
      isDayOff,
    });

    res.status(201).json(workDay);
  } catch (err) {
    console.error("Error createMasterWorkDay:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// PATCH /api/workdays/admin/:id
export async function updateMasterWorkDayController(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID робочого дня" });
    }

    const { date, startTime, endTime, isDayOff } = req.body;

    const data = {};
    if (date) data.date = new Date(date);
    if (startTime) data.startTime = new Date(startTime);
    if (endTime) data.endTime = new Date(endTime);
    if (typeof isDayOff === "boolean") data.isDayOff = isDayOff;

    const workDay = await workdaysService.updateMasterWorkDay(id, data);
    res.json(workDay);
  } catch (err) {
    console.error("Error updateMasterWorkDay:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/workdays/admin/:id
export async function deleteMasterWorkDayController(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID робочого дня" });
    }

    await workdaysService.deleteMasterWorkDay(id);
    res.json({ message: "Робочий день видалено" });
  } catch (err) {
    console.error("Error deleteMasterWorkDay:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/workdays/admin/generate
export async function generateMasterWorkDaysController(req, res) {
  try {
    const { masterId, from, to, pattern } = req.body;

    if (!masterId || !from || !to) {
      return res.status(400).json({
        message: "masterId, from і to є обов'язковими",
      });
    }

    const masterIdNum = Number(masterId);
    if (Number.isNaN(masterIdNum)) {
      return res
        .status(400)
        .json({ message: "Некоректний masterId" });
    }

    const days = await workdaysService.generateMasterWorkDaysForPeriod({
      masterId: masterIdNum,
      from,
      to,
      pattern,
    });

    res.status(201).json(days);
  } catch (err) {
    console.error("Error generateMasterWorkDays:", err);
    const status = err.statusCode || 500;
    res
      .status(status)
      .json({ message: err.message || "Server error" });
  }
}