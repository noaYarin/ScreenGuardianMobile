import { Router } from "express";
import { registerParentController, loginParentController, googleAuthController } from "../controllers/auth.controller.js";

const router = Router();


// POST /api/v1/auth/register-parent
// Register a new parent account
router.post("/register-parent", registerParentController);

// POST /api/v1/auth/login-parent
// Login parent and receive JWT token
router.post("/login-parent", loginParentController);


// POST /api/v1/auth/google-auth-parent
// Authenticate parent using Google OAuth
router.post("/google-auth-parent", googleAuthController);

export default router;