import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import {
  addChildController,
  getChildrenController,
  setChildActiveController,
  setSelectedDeviceController,
  getChildController
} from "../controllers/child.controller.js";
import { requireParent } from "../middlewares/requireParent.js";

const router = Router();

//POST api/v1/parent/add/child
router.post("/add/child", authJwt, requireParent, addChildController);
//GET api/v1/parent/get/children
router.get("/get/children", authJwt, requireParent, getChildrenController);
//GET api/v1/parent/get/child/:childId
router.get("/get/child/:childId", authJwt, requireParent, getChildController);
//PATCH api/v1/parent/set/child/:childId/active  
router.patch("/set/child/:childId/active", authJwt, requireParent, setChildActiveController);
//PATCH api/v1/parent/set/child/:childId/selected-device  
router.patch("/set/child/:childId/selected-device", authJwt, requireParent, setSelectedDeviceController);

export default router;