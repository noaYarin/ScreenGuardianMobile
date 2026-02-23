import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import parentsRoutes from "./routes/parents.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/parents", parentsRoutes);

app.use(errorHandler);

export default app;