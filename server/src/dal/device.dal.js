import mongoose from "mongoose";
import DeviceModel from "../models/device.model.js";
import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";

export async function createDevice(doc) {
  return DeviceModel.create(doc);
}

export async function findDeviceByBarcodeOrCode(session) {
  const existingDevice = await DeviceModel.findOne({
    $or: [
      { barcodeToken: session.barcodeToken },
      { code: session.code }
    ]
  }).lean();
  return existingDevice;
}


export async function findDeviceById(deviceId) {
  if (!mongoose.Types.ObjectId.isValid(deviceId)) {
    throw new AppError(CommonErrors.INVALID_DEVICE_ID);
  }
  return DeviceModel.findById(deviceId).lean();
}

export async function updateDeviceById(deviceId, patch) {
  if (!mongoose.Types.ObjectId.isValid(deviceId)) {
    throw new AppError(CommonErrors.INVALID_DEVICE_ID);
  }
  return DeviceModel.findByIdAndUpdate(
    deviceId,
    { $set: patch },
    { new: true }
  ).lean();
}