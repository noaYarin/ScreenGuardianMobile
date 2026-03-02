import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { lockDeviceController, unlockDeviceController } from "../controllers/device.controller.js";

const router = Router();

router.patch("/:deviceId/lock", authJwt, requireParent, lockDeviceController);
router.patch("/:deviceId/unlock", authJwt, requireParent, unlockDeviceController);

export default router;