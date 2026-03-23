import mongoose from "mongoose";
import { DeviceType } from "../constants/deviceType.js";
import { ApplicationSchema } from "./application.schema.js"
import { ScreenTimeSchema } from "./screenTime.schema.js"
import { DevicePlatform } from "../constants/devicePlatform.js";

export const DeviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, enum: Object.values(DeviceType), required: true },
        platform: { type: String, enum: Object.values(DevicePlatform), required: true },
        isLocked: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        code: { type: String, default: "" },
        location: { type: String, default: "" },
        barcodeToken: { type: String, default: "" },
        lastSeenAt: { type: Date, default: null },
        accessibilityEnabled: { type: Boolean, default: true },
        usageAccessEnabled: { type: Boolean, default: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
        applications: { type: [ApplicationSchema], default: [] },
        screenTime: {
            type: ScreenTimeSchema,
            default: () => ({})
        },
    }, { timestamps: true }
);
export default mongoose.model("Device", DeviceSchema);