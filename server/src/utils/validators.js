import mongoose from "mongoose";
import { AppError } from "./appError.js";

export function assertObjectId(id, errorObj) {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw new AppError(errorObj);
  }
}