import DeviceModel from "../models/device.model.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { assertValidObjectId } from "../utils/validators.js";

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
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);

  return DeviceModel.findById(deviceId).lean();
}

export async function updateDeviceById(deviceId, patch) {
  assertValidObjectId(deviceId, CommonErrors.INVALID_DEVICE_ID);
  return DeviceModel.findByIdAndUpdate(
    deviceId,
    { $set: patch },
    { new: true }
  ).lean();
}

export async function findDevicesByChildId(childId) {
  assertValidObjectId(childId, CommonErrors.INVALID_CHILD_ID);
  return DeviceModel.find({ childId }).lean();
}