import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      birthDate: { type: Date, required: true },
      gender: { type: String },
      interests: { type: [String], default: [] },
      coins: { type: Number, default: 0 },
      img: { type: String },
      isActive: { type: Boolean, default: true },
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    }, { timestamps: true }
  );
  export default mongoose.model("Child", ChildSchema);