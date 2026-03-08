import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { lockDeviceController, unlockDeviceController } from "../controllers/device.controller.js";

const router = Router();


// PATCH /api/v1/devices/:deviceId/lock
// Parent locks a device (blocks screen usage)
router.patch("/:deviceId/lock", authJwt, requireParent, lockDeviceController);

 //PATCH /api/v1/devices/:deviceId/unlock
// Parent unlocks a device
router.patch("/:deviceId/unlock", authJwt, requireParent, unlockDeviceController);

export default router;