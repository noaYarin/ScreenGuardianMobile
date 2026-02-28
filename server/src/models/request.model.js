import mongoose from "mongoose";
import { RequestStatus } from "../constants/status";

export const RequestSchema = new mongoose.Schema(
    {
        reason: { type: String, required: true },
        status: { type: String, enum: RequestStatus, required: true },
        requester: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
        reuestedMinutes: { type: Number, required: true },
    }, { timestamps: true }
);

export default mongoose.model("Request", RequestSchema);