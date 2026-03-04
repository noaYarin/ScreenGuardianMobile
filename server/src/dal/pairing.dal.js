import mongoose from "mongoose";
import PairingSessionModel from "../models/pairingSession.model.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";

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
    throw new AppError(CommonErrors.INVALID_SESSION_ID);
  }

  const now = new Date();

  /** if usedAt is not null, the session is already used
   if expiresAt is less than now, the session is expired **/
  const updated = await PairingSessionModel.findOneAndUpdate(
    {
      _id: sessionId,
      usedAt: null,            
      expiresAt: { $gt: now },   
    },
    { $set: { usedAt: now } },
    { new: true }
  ).lean();

  return updated; 
}