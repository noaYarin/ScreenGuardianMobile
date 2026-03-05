import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";
import { requireParent } from "../middlewares/requireParent.js";
import {
  createRequestController,
  getPendingRequestsController,
  decideRequestController,
  getMyRequestsController,
} from "../controllers/request.controller.js";

const router = Router();

// ===== Child routes =====
router.use("/child", authJwt, requireChild);

router.post("/child/add", createRequestController);
router.get("/child/get", getMyRequestsController);

// ===== Parent routes =====
router.use("/parent", authJwt, requireParent);

router.get("/parent/get/pending", getPendingRequestsController);
router.patch("/parent/set/:requestId/decision", decideRequestController);

export default router;