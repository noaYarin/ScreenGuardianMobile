import { Router } from "express";
import {
  registerParentController,
  loginParentController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";

const router = Router();


// POST /api/v1/auth/register-parent
// Register a new parent account
router.post("/register-parent", registerParentController);

// POST /api/v1/auth/login-parent
// Login parent and receive JWT token
router.post("/login-parent", loginParentController);


// POST /api/v1/auth/forgot-password
// Trigger forgot password email flow
router.post("/forgot-password", forgotPasswordController);

// POST /api/v1/auth/reset-password-confirm
// Confirm reset token and set new password
router.post("/reset-password-confirm", resetPasswordController);

export default router;