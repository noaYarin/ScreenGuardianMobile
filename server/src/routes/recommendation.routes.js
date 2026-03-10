import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { getParentRecommendationsController } from "../controllers/recommendation.controller.js";

const router = Router();

// GET /api/v1/recommendations/parent/:childId
router.get("/parent/:childId", authJwt, requireParent, getParentRecommendationsController);

export default router;