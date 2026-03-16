import mongoose from "mongoose";
import { Role } from "../constants/role.js";
import { ChildSchema } from './child.schema.js';

const ParentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    name: { type: String },
    phoneNumber: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.PARENT },
    children: { type: [ChildSchema], default: [] },
    // Forgot password - add password reset code and expires
    passwordResetCode: { type: String },
    passwordResetCodeExpires: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Parent", ParentSchema);