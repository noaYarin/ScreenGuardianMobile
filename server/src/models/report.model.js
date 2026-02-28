import mongoose from "mongoose";
import { ReportLimitFrequency } from "../constants/limitFrequency";

export const ReportSchema = new mongoose.Schema(
    {
        childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        ai_insights: { type: String, default: "" },
        limitFrequency: { type: String, enum: ReportLimitFrequency, required: true },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        screenTime: { type: mongoose.Schema.Types.ObjectId, ref: "ScreenTime", required: true },
    }, { timestamps: true }
);
export default mongoose.model("Report", ReportSchema);