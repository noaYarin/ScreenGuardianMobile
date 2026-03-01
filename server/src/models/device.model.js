import mongoose from "mongoose";
import { DeviceType } from "../constants/deviceType";
import {ApplicationSchema} from "../models/application.models"
import {ScreenTimeSchema} from "../models/screenTime.model"

export const DeviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, enum: DeviceType, required: true },
        isLocked: { type: Boolean },
        code: { type: Number, default: 0 },
        location: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
        barcode: { type: String, default: "" },
        applications: { type: [ApplicationSchema], default: [] },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
        screenTime: { type: ScreenTimeSchema, default: {} },
    }, { timestamps: true }
);
export default mongoose.model("Device", DeviceSchema);