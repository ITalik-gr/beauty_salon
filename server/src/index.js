import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import mastersRoutes from "./routes/masters.routes.js";
import workdaysRoutes from "./routes/workdays.routes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
  "http://localhost:5173",            // dev
  "beauty-salon-three-snowy.vercel.app", // прод
];

// app.use(cors());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/test", (req, res) => {
  console.log("🔥 /test route reached!");
  res.json({ message: "Test OK!" });
});

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/masters", mastersRoutes);
app.use("/api/workdays", workdaysRoutes);
app.use("/api/appointments", appointmentsRoutes);

app.use("/uploads", express.static("uploads"));


app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);