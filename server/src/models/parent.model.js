import mongoose from "mongoose";
import { Role } from "../constants/role.js";
import { ChildSchema } from './child.model.js';

const ParentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, 
    googleId: { type: String, sparse: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, enum: Role, default: Role.PARENT },
    childs: { type: [ChildSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Parent", ParentSchema);