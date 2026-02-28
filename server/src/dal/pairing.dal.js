import mongoose from "mongoose";
import PairingSessionModel from "../models/pairingSession.model.js";
import { AppError } from "../utils/appError.js";

export async function createPairingSession(doc) {
  return PairingSessionModel.create(doc);
}

export async function findByCode(code) {
  return PairingSessionModel.findOne({ code }).lean();
}

export async function findByBarcodeToken(barcodeToken) {
  return PairingSessionModel.findOne({ barcodeToken }).lean();
}

export async function consumePairingSession(sessionId) {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError({ status: 400, code: "INVALID_ID", message: "Invalid session id" });
  }
  const updated = await PairingSessionModel.findByIdAndUpdate(
    sessionId,
    { $set: { usedAt: new Date() } },
    { new: true }
  ).lean();
  return updated;
}
