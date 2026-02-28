import mongoose from "mongoose";
import { NotificationSeverity } from "../constants/severity";

export const NotificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        severity: { type: String, enum: NotificationSeverity, required: true },
        createdAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    }, { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);