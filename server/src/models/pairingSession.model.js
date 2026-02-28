import mongoose from "mongoose";

const PairingSessionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    barcodeToken: { type: String, required: true, unique: true, index: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, required: false },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("PairingSession", PairingSessionSchema);
