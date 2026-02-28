import mongoose from "mongoose";
import { DeviceType } from "../constants/deviceType";

export const DeviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, enum: DeviceType, required: true },
        isLocked: { type: Boolean },
        code: { type: Number, default: 0 },
        location: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
        barcode: { type: String, default: "" },
        applications: { type: [mongoose.Schema.Types.ObjectId], ref: "Application", default: [] },
        childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    }, { timestamps: true }
);
export default mongoose.model("Device", DeviceSchema);