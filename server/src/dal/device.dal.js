import DeviceModel from "../models/device.model.js";

export async function createDevice(doc) {
  return DeviceModel.create(doc);
}

export async function findDeviceByBarcode(barcode) {
  return DeviceModel.findOne({ barcode }).lean();
}

export async function updateDevice(deviceId, patch) {
  return DeviceModel.findByIdAndUpdate(
    deviceId,
    { $set: patch },
    { new: true }
  ).lean();
}