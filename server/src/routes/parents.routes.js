import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import {
  addChildController,
  getMyChildrenController,
  setChildActiveController,
} from "../controllers/parents.controller.js";

const router = Router();

// /api/v1/parents/me/children
router.post("/me/children", authJwt, addChildController);
router.get("/me/children", authJwt, getMyChildrenController);
// הקפאה/הפעלה (soft delete)
router.patch("/me/children/:childId/active", authJwt, setChildActiveController);
export default router;