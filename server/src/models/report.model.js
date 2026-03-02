import mongoose from "mongoose";
import { ReportLimitFrequency } from "../constants/limitFrequency.js";
import { AppBreakdownItemSchema } from "./appBreakDown.js";

export const ReportSchema = new mongoose.Schema(
    {
        childId: { type: mongoose.Schema.Types.ObjectId, required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        ai_insights: { type: String, default: "" },
        limitFrequency: { type: String, enum: ReportLimitFrequency, required: true },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        appBreakdown: { type: [AppBreakdownItemSchema], default: [] }
    }, { timestamps: true }
);
export default mongoose.model("Report", ReportSchema);