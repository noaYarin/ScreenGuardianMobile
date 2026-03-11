import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireChild } from "../middlewares/requireChild.js";
import { updateChildInterestsController } from "../controllers/child.controller.js";

const router = Router();

// PATCH /api/v1/child/interests
router.patch("/me/interests", authJwt, requireChild, updateChildInterestsController);

export default router;