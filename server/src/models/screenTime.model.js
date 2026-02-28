import mongoose from "mongoose";
import { ScreenTimeTarget } from "../constants/ScreenTimeTarget";

export const ScreenTimeSchema = new mongoose.Schema(
    {
        haveLimit: { type: Boolean, default: false },
        timeUsed: { type: Number, default: 0 },
        endDate: { type: Date, default: null },
        startDate: { type: Date, default: null },
        maxAllowedTime: { type: Number, default: 0 },
        remainingTime: { type: Number, default: 0 },
        targetType: {
            type: String,
            required: true,
            enum: Object.values(ScreenTimeTarget) 
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'targetType'
        }
    }, { timestamps: true }
);
export default mongoose.model("ScreenTime", ScreenTimeSchema);