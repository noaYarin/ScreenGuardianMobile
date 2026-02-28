import mongoose from "mongoose";
import { Role } from "../constants/role.js";

const ChildSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      birthDate: { type: Date, required: true },
      gender: { type: String },
      interests: { type: [String], default: [] },
      coins: { type: Number, default: 0 },
      img: { type: String },
      isActive: { type: Boolean, default: true },
      role: { type: String, enum: Role, default: Role.CHILD },
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent", required: true },
    }, { timestamps: true }
  );
  export default mongoose.model("Child", ChildSchema);