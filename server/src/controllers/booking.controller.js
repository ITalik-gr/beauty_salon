import { getServiceBooking } from "../services/booking.service.js";

export async function getServiceBookingController(req, res) {
  try {
    const { id } = req.params;
    const { from, days } = req.query;

    const data = await getServiceBooking(
      id,
      from,
      days ? Number(days) : 7
    );

    res.json(data);
  } catch (err) {
    console.error("Error getServiceBooking:", err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}