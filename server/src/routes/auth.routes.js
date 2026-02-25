import { Router } from "express";
import { registerParentController, loginParentController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register-parent", registerParentController);
router.post("/login-parent", loginParentController);

export default router;