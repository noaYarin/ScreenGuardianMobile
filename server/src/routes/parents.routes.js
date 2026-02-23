import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { addChildController, getMyChildrenController } from "../controllers/parents.controller.js";

const router = Router();

// /api/v1/parents/me/children
router.post("/me/children", authJwt, addChildController);
router.get("/me/children", authJwt, getMyChildrenController);

export default router;