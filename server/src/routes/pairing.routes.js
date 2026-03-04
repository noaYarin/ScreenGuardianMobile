import { Router } from "express";
import { authJwt } from "../middlewares/authJwt.js";
import { requireParent } from "../middlewares/requireParent.js";
import { generatePairingController, linkPairingController } from "../controllers/pairing.controller.js";

const router = Router();

// Parent: create pairing session (4-digit code + barcode token)
router.post("/generate-code", authJwt, requireParent, generatePairingController);

// Child: link device using code or scanned barcodeToken.
router.post("/link-device", authJwt, linkPairingController);

export default router;
