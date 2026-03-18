import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import {
  addChildController,
  getChildrenController,
  setChildActiveController,
  setSelectedDeviceController
} from "../controllers/child.controller.js";
import { requireParent } from "../middlewares/requireParent.js";

const router = Router();

// api/v1/parent/add/child
router.post("/add/child", authJwt, requireParent, addChildController);
// api/v1/parent/get/children
router.get("/get/children", authJwt, requireParent, getChildrenController);
// api/v1/parent/set/child/:childId/active  
router.patch("/set/child/:childId/active", authJwt, requireParent, setChildActiveController);

// api/v1/parent/set/child/:childId/selected-device  
router.patch("/set/child/:childId/selected-device", authJwt, requireParent, setSelectedDeviceController);

export default router;