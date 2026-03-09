import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";

import {
  getParentNotificationsController,
  markNotificationAsReadController
} from "../controllers/notification.controller.js";

const router = Router();

 //GET /api/v1/notifications//parent
// Get notifications for parent
router.get("/parent", authJwt, requireParent, getParentNotificationsController);

 //PATCH /api/v1/notifications/parent/:notificationId/read
// Mark notification as read
router.patch("/parent/:notificationId/read", authJwt, requireParent, markNotificationAsReadController);

export default router;