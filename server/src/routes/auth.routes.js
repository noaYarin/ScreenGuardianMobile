import { Router } from "express";
import { registerParentController, loginParentController, googleAuthController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register-parent", registerParentController);
router.post("/login-parent", loginParentController);
router.post("/google-auth-parent", googleAuthController);

export default router;