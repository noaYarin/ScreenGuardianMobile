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

// POST /api/v1/requests/child/add
// Child creates a new screen-time extension request
router.post("/child/add", createRequestController);

// GET /api/v1/requests/child/get
// Child gets their own requests
router.get("/child/get", getMyRequestsController);


// ===== Parent routes =====
router.use("/parent", authJwt, requireParent);


// GET /api/v1/requests/parent/get/pending
// Parent gets all pending requests for their children
router.get("/parent/get/pending", getPendingRequestsController);


// Full route: PATCH /api/v1/requests/parent/set/:requestId/decision
// Parent approves or rejects a request
router.patch("/parent/set/:requestId/decision", decideRequestController);

export default router;