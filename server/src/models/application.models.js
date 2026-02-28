import mongoose from "mongoose";

export const ApplicationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        icon: { type: String, default: "default.png" },
        packageName: { type: String, required: true },
        isBlocked: { type: Boolean, default: true },
    }, { timestamps: true }
);
export default mongoose.model("Application", ApplicationSchema);