import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));