import mongoose from "mongoose";
import { Role } from "../constants/role.js";
import { AvatarSchema } from "./avatar.model.js";


export const ChildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String },
    interests: { type: [String], default: [] },
    coins: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: Role, default: Role.CHILD },
    achievementIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Achievement",
      default: []
    },
    avatar: { type: AvatarSchema, default: () => ({}) },
  },

  { timestamps: true }
);
