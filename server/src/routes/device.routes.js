import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  lockDeviceController,
  unlockDeviceController,
  getDevicesByChildController, getDeviceScreenTimeController, updateDeviceScreenTimeController,
  setDeviceActiveController,
  getDevicePolicyController
} from "../controllers/device.controller.js";

const router = Router();

// GET /api/v1/devices/child/:childId
// Parent gets all devices of specific child
router.get("/child/:childId", authJwt, requireParent, getDevicesByChildController);

// PATCH /api/v1/devices/:deviceId/lock
// Parent locks a device (blocks screen usage)
router.patch("/:deviceId/lock", authJwt, requireParent, lockDeviceController);

 //PATCH /api/v1/devices/:deviceId/unlock
// Parent unlocks a device
router.patch("/:deviceId/unlock", authJwt, requireParent, unlockDeviceController);

// GET /api/v1/devices/:deviceId/policy
// Get device policy for child app
router.get("/:deviceId/policy", authJwt, getDevicePolicyController);

 //GET /api/v1/devices/:deviceId/screen-time
// Get current screen-time settings for a device
router.get("/:deviceId/screen-time", authJwt, requireParent, getDeviceScreenTimeController);

 //PATCH /api/v1/devices/:deviceId/screen-time
// Update screen-time settings for a device
router.patch("/:deviceId/screen-time", authJwt, requireParent, updateDeviceScreenTimeController);

// PATCH /api/v1/devices/:deviceId/active
// Parent activates/deactivates a device
router.patch("/:deviceId/active", authJwt, requireParent, setDeviceActiveController);


export default router;