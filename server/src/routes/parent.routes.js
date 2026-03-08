import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import {
  addChildController,
  getMyChildController,
  setChildActiveController,
} from "../controllers/child.controller.js";
import { requireParent } from "../middlewares/requireParent.js";

const router = Router();

// api/v1/parent/add/child
router.post("/add/child", authJwt, requireParent, addChildController);
// api/v1/parent/get/child
router.get("/get/child", authJwt, requireParent, getMyChildController);
// api/v1/parent/set/child/:childId/active  
router.patch("/set/child/:childId/active", authJwt, requireParent, setChildActiveController);

export default router;