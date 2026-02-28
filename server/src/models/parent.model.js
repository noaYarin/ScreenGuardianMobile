import mongoose from "mongoose";
import ChildSchema from "./child.model";

const ParentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // hash
    name: { type: String, required: true },
    phoneNumber: { type: String },
    children: { type: [ChildSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Parent", ParentSchema);