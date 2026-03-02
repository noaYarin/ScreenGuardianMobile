import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import pairingRoutes from "./routes/pairing.routes.js";
import deviceRouter from "./routes/device.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/parent", parentRoutes);
app.use("/api/v1/pairing", pairingRoutes);
app.use("/api/v1/devices", deviceRouter);

app.use(errorHandler);

export default app;