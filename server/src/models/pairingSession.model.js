import mongoose from "mongoose";

const PairingSessionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    barcodeToken: { type: String, required: true, unique: true, index: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, required: true },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index – document will be removed automatically when expired
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PairingSession", PairingSessionSchema);
