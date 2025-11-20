import * as appointmentsService from "../services/appointments.service.js";

// POST /api/appointments  (USER)
export async function createAppointmentController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Необхідна авторизація" });
    }

    const { masterId, serviceId, startTime, note } = req.body;

    const appointment = await appointmentsService.createAppointment(userId, {
      masterId,
      serviceId,
      startTime,
      note,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Error createAppointment:", err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}

// GET /api/appointments/my  (USER)
export async function getMyAppointmentsController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Необхідна авторизація" });
    }

    const appointments = await appointmentsService.getUserAppointments(userId);
    res.json(appointments);
  } catch (err) {
    console.error("Error getMyAppointments:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/appointments/admin  (ADMIN)
export async function getAllAppointmentsController(req, res) {
  try {
    const appointments = await appointmentsService.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    console.error("Error getAllAppointments:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// PATCH /api/appointments/admin/:id/status  (ADMIN)
export async function updateAppointmentStatusController(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID бронювання" });
    }

    const { status } = req.body;

    const appointment =
      await appointmentsService.updateAppointmentStatus(id, status);

    res.json(appointment);
  } catch (err) {
    console.error("Error updateAppointmentStatus:", err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}