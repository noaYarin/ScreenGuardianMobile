import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";
import {
  getCurrentChildProfileController,
  updateChildInterestsController,
  updateCurrentChildProfileController,
} from "../controllers/child.controller.js";

const router = Router();

// GET /api/v1/child/profile
router.get("/profile", authJwt, requireChild, getCurrentChildProfileController);

// PATCH /api/v1/child/me/interests
// Update child interests (self)
router.patch("/interests", authJwt, requireChild, updateChildInterestsController);

router.put("/profile", authJwt, requireChild, updateCurrentChildProfileController);

export default router;